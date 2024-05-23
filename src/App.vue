<template>
  <div>
    <header class="header">
        <div class="logo-container">
            <img src="src/assets/bookie.png" alt="b">
            <h1 @click="redirect">ai4ed</h1>
        </div>
        <nav class="nav">
          <router-link :to="{ name: 'Research'}">Research</router-link>
            <a href="#examples">Examples</a>
            <a href="#contact">Contact</a>
        </nav>
        <div class="actions">
            <router-link :to="{ name: 'Study'}" class="begin-btn">GET STARTED</router-link>

            <!-- <button class="begin-btn">GET STARTED</button>
            <router-link :to="{ name: 'Study'}">Study</router-link> -->
            <!-- <a href="#signup">Sign Up</a>
            <a href="#signin">Sign In</a> -->
            <router-link :to="{ name: 'Login'}">Log in</router-link>
            <router-link :to="{ name: 'Signup'}">Sign up</router-link>
            
        </div>
      </header>
    <router-view/>
    </div>
</template>

<script>
  export default {
    methods: {
      redirect() {
        this.$router.push({ name: 'Home'})
      },
      back() {
        this.$router.go(-1)
      },
      forward() {
        this.$router.go(1)
      },
    }
}
</script>

<style>
body {
    margin: 0;
    padding: 0;
    background: url('./assets/wallpaperpurple.jpeg') no-repeat center center fixed; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: -25px;
}


.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  padding-left: 400px;

  background-color: transparent; /* Remove background color */
}

.logo-container {
    display: flex;
    align-items: center;
    flex-grow: 0.08;
    font-size: 1.5em; /* Make logo slightly larger */
    font-weight: bold;
    color: white; /* Set text color to white */
    font-family: 'Roboto', sans-serif; /* Set font to Roboto */
}

.logo-container img { /* Adjust if you have a logo image */
  height: 100px;
  margin-right: -40px; 
}

.nav a {

  margin: 0 15px; /* Adjust spacing as needed */
  text-decoration: none;
  color: white;
  font-family: 'Roboto', sans-serif; /* Example font choice */
  transition: color 0.3s, transform 0.3s;
}

.nav a:hover {
    color: rgb(214, 212, 212); /* Match your button color for cohesiveness */
    transform: translateY(-3px);
}

.actions {
  /* flex-grow: 0.01; */
  font-family: 'Roboto', sans-serif;
  margin-left: 250px; /* Push actions to the right for better spacing */
}

.actions a {
  margin-left: 10px; 
  text-decoration: none; /* Remove underline */
  color: white; /* Slightly darker gray for non-button links */
} 

.begin-btn {
  position: relative;
  background-color: white;
  color: rgb(29, 29, 184);
  border: none;
  border-radius: 5px;
  padding: 12px 40px; /* Slightly bigger button */
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, transform 0.3s; /* Add subtle transition */
  text-align: right;
}

.actions .begin-btn {
  color: rgb(29, 29, 184);
}

.begin-btn::before {
  content: ""; /* Add this line */
  position: absolute; /* Add this line */
  left: 10px; /* Add this line */
  top: 50%; /* Add this line */
  transform: translateY(-50%);
  background-image: url('@/assets/rocket.gif'); /* Add this line */
  background-repeat: no-repeat; /* Add this line */
  background-size: contain; /* Add this line */
  width: 30px; /* Add this line */
  height: 30px;
}


.begin-btn:hover {
    background-color: rgb(23, 23, 250); 
    color: white;
    /* Moves button up slightly */
    transform: translateY(-3px)
}

@media (max-width: 600px) {
    .header {
        flex-direction: column;
        align-items: flex-start; /* Align items to the start when stacked */
    }
    .nav, .actions { 
        margin-top: 10px;  
    }
}
</style>



