// Snake Game JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Game canvas setup
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  
  // Game elements
  const scoreEl = document.getElementById('score');
  const highScoreEl = document.getElementById('highScore');
  const restartBtn = document.getElementById('restartBtn');
  const mobileControls = document.querySelectorAll('.mobile-controls button');
  
  // Game configuration
  const gridSize = 20;
  const gameSpeed = 120; // Lower is faster
  
  // Game state variables
  let snake, food, direction, nextDirection, isPlaying;
  let score, highScore = localStorage.getItem('snakeHighScore') || 0;
  let gameLoop;
  
  // Game colors
  const colors = {
      snake: {
          head: '#4ade80', // Green head
          body: '#22c55e'  // Darker green body
      },
      food: '#fb7185',     // Red food
      grid: '#1e293b'      // Dark grid lines
  };
  
  // Sound effects (initialize audio)
  const sounds = {
      eat: new Audio('data:audio/wav;base64,UklGRhQFAABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YfAEAACAgICAgICAgICAgICAgICAgICAgICGgn+BgH9+gH2Af3+BgYKDg4ODg4GAfXp5eXp8fYCDhoiIiIeEgHt2c3Fxc3Z7gIWKjpGQjoqDfHZwbGlqbnR7g4qQlZiYlI+HeHFqZGJjZ296gopUmJuZlpCKeHBnYF1eYWdweICHjpOWmJiUjoZ+dW5oZWVobnV8g4mQlZmZlo+IdnBoZWRnbHN6gYiPk5aYl5OOiIB7dXBubHBze4GHjZKWmJeTjYZ/enVycXJ0d3yBhoqOkZKSkY6JhYB8eXd3eHp9gIOGiYuNjo6Mi4iFgn98e3p7fH9/gYOFhoeIiIeGhIKAfnt6eXl7fH6BhIaIiYmIh4SCf3x5d3Z3eHp+goWJi46PjoyJhYF8d3Nxc3V4fYOJj5OWl5aTjoZ+dnBsampsdHqBiI6UmJqZlo+HeHBpYmFjZ296gYmQlpmamJOMhHt0bmpoaW1yeH+Gi5CUlpeVkYuEfnhzcG9xdHh+g4iNkJKTkY+LiIWCf3x7e3x+gIKEhoiJiYmIhoOAfHp4d3h5e36Ch4qNj5CQjouHgn15dnR1dnh8gYaNkJOUlJKOioN+eXVycnN2eoCFi5CUlpeVkYuEfXZwbGtsbXF3foSKkJSXl5aTjYV+d3FtbGxucnZ8g4iNkZOUko+LiISAf3t7e31+gIOFh4iJiIiGhIJ/fXp5eHl6fH+ChYiKi4yLioiFgn98enh3eHp9gIWJjI+QkI6LiIR/e3h2dnd5fYCFio6RkpKQjYiDfnp2dHR1eHyAhYqOkZOTkY2Ig316dnR0dXh7gISJjZCRkY+MiYWBfnt5eXp8f4KFiIqMjIyLioeDgH16eXl6e36BhIeKi4yMi4mGg398enh4eXt+gYWIi42OjoyJhoJ+e3l4eHp8f4OHi46PkI+Mi4eDf3x5d3d5e3+ChomMjo+PjYqGgn57eHd3eXt/goaKjY+PkI2KhoF9enh3d3l8f4OHi46QkI+MioWBfXp4d3h6fH+ChYmMjo6OjIqGgn57eXh5e32AhIeKjI2NjIqHg4B9e3p6e31/goWIi4yMjIuIhYJ/fHp5eXp8f4KFiIqMjIyKiIWCf3x6eXl6fH+ChYiLjI2MioiEgX58enh4enx/goWJi42OjYuIhIF+e3l4eHp8f4OGio2Oj46LiISAfXp4d3h6fH+DiIuOj4+OjIiEgH16eHd4enx/g4eKjY+PjoyJhYF+e3l4eXt9gISHio2Oj42KhoJ/fHp5eXp8f4KFiYuNjYyKh4SBfnt6eXp7foGEh4qMjYyLiYaCf3x6eXl6fH+ChYmLjY2MioeDgH17eXl6e3+ChYiLjY2Mi4iFgX97eng='),
      gameOver: new Audio('data:audio/wav;base64,UklGRrQHAABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YZAHAACAgICAgICAgICAgICAgICAgICAgICAgICAgICEiIyQlJicnqCiVFJQTkxKSEZEQj5APDo4NjQyMCw8XJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJBckDwsLjI0Njg6PEBCREZISkxOUFJUoqCenJqYlJKOioiGhIKAgH56eHZ0cnBualQ4LCQcFAz84NjQyMC4sKigmJCIgHhwYFA4HAw86O0IHCY2RlZmdnZ2cmpaTkY8MigiGBAI+PDo4NjQzMi8uLSwr66qqaelpqanqaqqrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/v6+fj39vX09HOysXAvLi0sKyopKCcmJSTj4uHg35AwDgwKCMdGBQMBgIAAgYMEBgdIyg4QMC+wMTIzNDU2Nbc6Oro6Obj39vX087KxcC8t7OuqaUIC5MJBYmFgX15dXV1dnp+goaKj5OXm5+kqKyws7a6vcDDx8rN0NLV19ja3N7g4uPl5+jp6uvs7e7u7evp5eLf3NjV0c3JxcC8t7OuqaWgnZmVkY2JhSUhJSktMTU5PUFDRUdJS01PT1FRU1NVVVdXWFlZW11dXl9fYGBhYWJhYmJiYmNjY2NjY2RkZGRkZGRkZGRkY2RjY2NjYmJhYWFgX15eXFtaWVhVVFJQTkxKSEVDQT48OTYzLy0qKCUjIR8eHBsZGBYVExMSEBAPDg0mcwMDAwMDAwQEBAUFBgYGBwcICAkJCgoLCwwMDQ0ODg8PEBARERISExMUFBUVFhYXFxgYGBkaGhsbHBwdHR4eHx8gICEhIiIjIyQkJSUmJiYnKCgpKSoqKyssLC0tLi4vLzAwMTEyMjMzNDQ1NTY2Nzc4ODk5Ojo7Ozw8PT0+Pj8/QEBBQUJCQkNERUVGRkdHSEhJSUpKS0tMTE1NTk5PT1BQUVFSUlNTVFRVVVZWV1dYWFlZWlpbW1xcXV1eXl9fYGBhYWJiY2NkZGVlZmZnZ2hoaWlqamtra2xsbW1ubm9vcHBxcXJyc3N0dHV1dnZ3d3h4eXl6ent7fHx9fX5+f3+AgIGBgoKDg4SEhYWGhoeHiIiJiYqKi4uMjI2Njo6Pj5CQkZGSkpOTlJSVlZaWl5eYmJmZmpqbm5ycnZ2enp+foKChoaKio6OkpKWlpqanp6ioqamqqaurq6ysra2urq+vsLCxsbKys7O0tLW1tra3t7i4ubm6uru7vLy9vb6+v7/AwMHBwsLDw8TExcXGxsfHyMjJycqxpZ+YkoyCfHRuZl5YUEg/Jho4AAwEDBgkLjhGUFhgaG93fYKIjpSaoaexury9wcTGycvM0NHS1NTV19fY2dna29vb3Nzc3d3d3t7e39/f3+Dg4OHh4eHi4uLj4+Pj4+Pj5OTk5OTk5OTk5OTj4+Pj4+Pi4uLi4eHh4ODg39/e3t3d3Nza2djX1dTSz83KyMXCv7y5trOvq6ekoJySjYiDfnpzbGZfWVNMRj8mgCQgHBoYFhQSEA4MCggGBAICAgQGCAwOEBQWGBocICRgKC4zOD1CRkpOUlVZXF9iZGdpa21vcHJzdHZ3eHp6e3x9fn9/gIGBgoKDg4SEhISFhYWFhYWFhYWFhYWEhISEg4ODgoKBgYCAfn59fHt6eXh2dXRzcXBubGtpZ2ViYF5bWVZTUU5LR0RAPjs3My8rJyMgHBn8zBjQHOQg7CT4KPwtADEENAg4DDkQPRRBGEUdSSFOJVIpVy1cMWA2ZTppP25Dc0h4TH9RhFaKW5BglmacbKJyqHiugbSHuY6/lcSbzKLSqdmy37voxu/Q+NoA5QntEvQcACYJMRI8G0YlTy5YOGJBa0t1VH9ehmiPc5l9o4itkriXw6HOq9m26cH01QDqCv4U+R7pKNwyxzzMRsZQul6uaKJynGaQWoROeEJsNmAqVB5IDTz7MPUk6RjeC9L+xfK15qnTnMaPun6scZ9kjFZ/SXI8ZS9YIksVPgg72jTOJ8IbthCrBZ/6k++O5InZjc6CwXe2bKtho1aYS402hCt5IW4XXgxT/0fsN+Euzx3EC7n5ruSj053Iks2C13jndP+GGZ8z+k4Waz6HY6SH1K8TzmTsxgofKj5Qb2KDdJeHspXOqQrHLOVgBYYl5EcqlU630NnuIAw5N1Zvj4inorrI0N70+xAPKCVCXnV6kJmmvdHn/BIqZYq2zuP9Jhg/W3Z+mKe9zuDzEis+WXGNpL/a9g8qSGZ+lrHO5f4ZN1VzjqrJ5wIhRGJ7mLfV+yhKan2cv+QTP2p/ntPwRW6GnsbxQ2yEnM30TXWMpdfxQmuEoc/wR26Jpdv3TWmAndb0RmiDpN33SmWAn9j0Q2R/n9r1RG2Fodb0RG2GotX0RW+Io9b1SXONqN37T3iSrt//UX2XsuL/UX2Wst/9UHyVr9/9UnuUr938UXuVsOH/Vn6YtOH/U32Xst38UXuUsN77T3iRrN36TnaQq936T3eRq936UXqTrN77UXmSq9/8T3iRq9/9UHmTrdnk0tPS1NbX2Nrb3N3e3t/g4OHh4eLi4uPj4+Pk5OTk5OTk5OTk5OTk5OPj4+Pj4+Li4uLh4eHh4ODf397e3d3c3Nva2djX1tXU09HQz87My8nIxsXDwb+9u7m3tbOxr62rqaelop+BgA==')
  };
  
  // Game initialization
  function init() {
      // Reset game state
      snake = [{ x: 160, y: 200 }];
      food = {};
      direction = 'right';
      nextDirection = 'right';
      isPlaying = true;
      score = 0;
      
      // Update score display
      scoreEl.textContent = score;
      highScoreEl.textContent = highScore;
      
      // Generate first food
      generateFood();
      
      // Reset game speed
      if (gameLoop) clearInterval(gameLoop);
      gameLoop = setInterval(gameUpdate, gameSpeed);
  }
  
  // Generate food at random position
  function generateFood() {
      // Calculate grid cells
      const gridCellsX = canvas.width / gridSize;
      const gridCellsY = canvas.height / gridSize;
      
      // Generate random position
      let newFood;
      do {
          newFood = {
              x: Math.floor(Math.random() * gridCellsX) * gridSize,
              y: Math.floor(Math.random() * gridCellsY) * gridSize
          };
      } while (isOnSnake(newFood)); // Make sure food isn't on snake
      
      food = newFood;
  }
  
  // Check if position is on snake
  function isOnSnake(pos) {
      return snake.some(segment => segment.x === pos.x && segment.y === pos.y);
  }
  
  // Draw Snake
  function drawSnake() {
      snake.forEach((segment, index) => {
          // Different color for head
          ctx.fillStyle = index === 0 ? colors.snake.head : colors.snake.body;
          ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
          
          // Add slight border for segments
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
      });
  }
  
  // Draw Food
  function drawFood() {
      ctx.fillStyle = colors.food;
      
      // Draw circular food
      ctx.beginPath();
      ctx.arc(
          food.x + gridSize/2, 
          food.y + gridSize/2, 
          gridSize/2 - 2, 
          0, 
          Math.PI * 2
      );
      ctx.fill();
      
      // Add shine effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(
          food.x + gridSize/3, 
          food.y + gridSize/3, 
          gridSize/4, 
          0, 
          Math.PI * 2
      );
      ctx.fill();
  }
  
  // Draw Grid (subtle background)
  function drawGrid() {
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 0.5;
      
      for (let x = 0; x <= canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
      }
      
      for (let y = 0; y <= canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
      }
  }
  
  // Move Snake
  function moveSnake() {
      // Apply next direction
      direction = nextDirection;
      
      // Calculate new head position
      const head = { ...snake[0] };
      
      switch (direction) {
          case 'up':
              head.y -= gridSize;
              break;
          case 'down':
              head.y += gridSize;
              break;
          case 'left':
              head.x -= gridSize;
              break;
          case 'right':
              head.x += gridSize;
              break;
      }
      
      // Check for game over (wall collision)
      if (
          head.x < 0 || 
          head.x >= canvas.width || 
          head.y < 0 || 
          head.y >= canvas.height
      ) {
          gameOver();
          return;
      }
      
      // Check for collision with self
      if (isOnSnake(head)) {
          gameOver();
          return;
      }
      
      // Add new head
      snake.unshift(head);
      
      // Check if snake eats food
      if (head.x === food.x && head.y === food.y) {
          // Increase score
          score++;
          scoreEl.textContent = score;
          
          // Update high score if needed
          if (score > highScore) {
              highScore = score;
              highScoreEl.textContent = highScore;
              localStorage.setItem('snakeHighScore', highScore);
          }
          
          // Play eat sound
          sounds.eat.currentTime = 0;
          sounds.eat.play();
          
          // Generate new food
          generateFood();
          
          // Speed up game slightly (cap at min interval)
          if (gameSpeed > 60) {
              clearInterval(gameLoop);
              gameSpeed = Math.max(60, gameSpeed - 2);
              gameLoop = setInterval(gameUpdate, gameSpeed);
          }
      } else {
          // Remove tail if not eating
          snake.pop();
      }
  }
  
  // Game over function
  function gameOver() {
      isPlaying = false;
      clearInterval(gameLoop);
      sounds.gameOver.play();
      
      // Show game over screen
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 20);
      
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 20);
      
      ctx.font = '16px Arial';
      ctx.fillText('Press Restart to play again', canvas.width/2, canvas.height/2 + 60);
  }
  
  // Game update function (called on each interval)
  function gameUpdate() {
      if (!isPlaying) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw game elements
      drawGrid();
      drawFood();
      moveSnake();
      drawSnake();
  }
  
  // Event listener for keyboard controls
  document.addEventListener('keydown', function(e) {
      switch (e.key) {
          case 'ArrowUp':
              if (direction !== 'down') nextDirection = 'up';
              break;
          case 'ArrowDown':
              if (direction !== 'up') nextDirection = 'down';
              break;
          case 'ArrowLeft':
              if (direction !== 'right') nextDirection = 'left';
              break;
          case 'ArrowRight':
              if (direction !== 'left') nextDirection = 'right';
              break;
      }
  });
  
  // Mobile touch controls
  let touchStartX = 0;
  let touchStartY = 0;
  
  canvas.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      e.preventDefault();
  });
  
  canvas.addEventListener('touchmove', function(e) {
      e.preventDefault(); // Prevent scrolling
  });
  
  canvas.addEventListener('touchend', function(e) {
      if (!isPlaying) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;
      
      // Determine swipe direction by finding the greatest difference
      if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal swipe
          if (dx > 0 && direction !== 'left') {
              nextDirection = 'right';
          } else if (dx < 0 && direction !== 'right') {
              nextDirection = 'left';
          }
      } else {
          // Vertical swipe
          if (dy > 0 && direction !== 'up') {
              nextDirection = 'down';
          } else if (dy < 0 && direction !== 'down') {
              nextDirection = 'up';
          }
      }
      
      e.preventDefault();
  });
  
  // Mobile control buttons (if present)
  mobileControls.forEach(button => {
      button.addEventListener('click', function() {
          if (!isPlaying) return;
          
          const dir = this.getAttribute('data-direction');
          
          switch (dir) {
              case 'up':
                  if (direction !== 'down') nextDirection = 'up';
                  break;
              case 'down':
                  if (direction !== 'up') nextDirection = 'down';
                  break;
              case 'left':
                  if (direction !== 'right') nextDirection = 'left';
                  break;
              case 'right':
                  if (direction !== 'left') nextDirection = 'right';
                  break;
          }
      });
  });
  
  // Restart button event listener
  restartBtn.addEventListener('click', init);
  
  // Prevent spacebar from scrolling the page
  window.addEventListener('keydown', function(e) {
      if (e.key === ' ' && e.target === document.body) {
          e.preventDefault();
      }
  });
  
  // Handle window resize
  function handleResize() {
      // Only adjust if game is not in progress
      if (!isPlaying) {
          // Set canvas size based on container
          const container = canvas.parentElement;
          canvas.width = Math.floor((container.clientWidth - 20) / gridSize) * gridSize;
          canvas.height = Math.floor((container.clientHeight - 20) / gridSize) * gridSize;
          
          // Redraw game over screen if needed
          if (!isPlaying) {
              gameOver();
          }
      }
  }
  
  // Listen for window resize
  window.addEventListener('resize', handleResize);
  
  // Initialize the game
  handleResize();
  init();
});