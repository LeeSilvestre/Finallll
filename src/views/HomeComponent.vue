<template>
  <div class="page-container">
    <div class="box-form">
      <div class="left">
        <div class="overlay">
          <img class="logo-left" src="../assets/rabguardlogo.png" alt="hi">
          <h2 class="left-title">"Your Shield Against Rabies"</h2>
        </div>
      </div>

    <div class="right">
      <img class="logo-right" src="../assets/Logo-Health.png" alt="hi">
      <h1>Olongapo City</h1>
      <h2>Animal Bite Treatment Center</h2>
      <div class="inputs">
        <span><i class="fa-solid fa-user"></i></span><input v-model="username" type="text" placeholder="Username">
        <br>
        <span><i class="fa-solid fa-lock"></i></span><input v-model="password" type="password" placeholder="Password">
      </div>

      <br><br>

      <div class="remember-me--forget-password">
        <a href></a>
        <button @click="login" class="login-button">Login</button>
      </div>

    
    </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
export default {
  data() {
    return {
      username: '',
      password: '',
      rememberMe: false
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/admin');
        const users = response.data;

        const user = users.find(
          user => user.admin_username === this.username && user.admin_password === this.password
        );

        if (user) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: `Welcome Admin!`,
            timer: 1500,
            showConfirmButton: false,
            customClass: {
              popup: 'smaller-toast'
            }
          });
          this.$router.push('/dashboard');
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Email or Password!"
          });
        }
      } catch (error) {
        console.error('An error occurred while logging in:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!"
        });
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Playfair+Display:ital@1&display=swap');
.logo-left{
  margin-top: 60px;
  height: 15rem;
  width: 15rem;
  transition: 0.2s ease-out;
  border-radius: 5rem;
}

.logo-right{
  height: 9rem;
  width: 9rem;
  transition: 0.2s ease-out;
  align-self: center;
  border-radius: 5rem;
}

body {
  background-image: white;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  font-family: "Open Sans", sans-serif;
  color: #333333;
}

.box-form {
  margin: 0;
  width: 60%;
  background: #FFFFFF;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex: 1 1 100%;
  align-items: stretch;
  justify-content: space-between;
  box-shadow: 0 0 20px 6px #090b6f85;
}
@media (max-width: 980px) {
  .box-form {
    flex-flow: wrap;
    text-align: center;
    align-content: center;
    align-items: center;
  }
}
.left-title {
  font-family: 'Product Sans', sans-serif;
  font-size: 24px;
  font-style: italic;
  margin-top: 20px;
  color: #f0f0f0;
}
.box-form div {
  height: auto;
}
.box-form .left {
  color: #FFFFFF;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
}
.box-form .left .overlay {
  padding: 30px;
  width: 100%;
  height: 100%;
  background-color:#339933;
  overflow: hidden;
  box-sizing: border-box;
}
.box-form .left .overlay h1 {
  font-size: 10vmax;
  line-height: 1;
  font-weight: 900;
  margin-top: 40px;
  margin-bottom: 20px;
}
.box-form .left .overlay span p {
  margin-top: 30px;
  font-weight: 900;
}
.box-form .left .overlay span a {
  background: #3b5998;
  color: #FFFFFF;
  margin-top: 10px;
  padding: 14px 50px;
  border-radius: 100px;
  display: inline-block;
  box-shadow: 0 3px 6px 1px #042d4657;
}
.box-form .left .overlay span a:last-child {
  background: #1dcaff;
  margin-left: 30px;
}
.box-form .right {
  width:60%;
  padding: 40px;
  overflow: hidden;
}
@media (max-width: 980px) {
  .box-form .right {
    width: 100%;
  }
}
.box-form .right h5 {
  font-size: 6vmax;
  line-height: 0;
}
.box-form .right p {
  font-size: 14px;
  color: #B0B3B9;
}
.box-form .right .inputs {
  overflow: hidden;
}
.box-form .right input {
  width: 80%;
  padding: 10px;
  margin-top: 25px;
  font-size: 16px;
  border: none;
  outline: none;
  border-bottom: 2px solid #B0B3B9;
}
.box-form .right .remember-me--forget-password {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box-form .right .remember-me--forget-password input {
  margin: 0;
  margin-right: 7px;
  width: auto;
}

.login-button {
  color: #fff;
  font-size: 20px;
  padding: 12px 35px;
  border-radius: 50px;
  display: inline-block;
  border: 0;
  outline: 0;
  background-color: #339933;
  transition: background-image 0.3s;
  text-decoration: none;
  opacity: 90%;
  margin-right: 40px;
  width: 80%;

}

.login-button:hover {
opacity: 100%;
}

label {
  display: block;
  position: relative;
  margin-left: 30px;
}

label::before {
  content: ' \f00c';
  position: absolute;
  font-family: FontAwesome;
  background: transparent;
  border: 3px solid #70F570;
  border-radius: 4px;
  color: transparent;
  left: -30px;
  transition: all 0.2s linear;
}

label:hover::before {
  font-family: FontAwesome;
  content: ' \f00c';
  color: #fff;
  cursor: pointer;
  background: #70F570;
}

label:hover::before .text-checkbox {
  background: #70F570;
}

label span.text-checkbox {
  display: inline-block;
  height: auto;
  position: relative;
  cursor: pointer;
  transition: all 0.2s linear;
}

label input[type="checkbox"] {
  display: none;
}
.page-container {
  background-image: url('../assets/abtc-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
  overflow: hidden; /* Remove scrollbars */
  display: flex; /* Flexbox for centering */
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  margin: 0; /* Remove default margin */
}

/* Styling for the form container */
.box-form {
  background: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 0 20px 6px #090b6f85;
  width: 100%;
  max-width: 1000px; /* Maximum width of the form */
  box-sizing: border-box; /* Ensure padding is included in width */
  overflow: hidden; /* Hide any overflow */
  margin-left: 20px;
}

/* Additional style tweaks for responsiveness */
@media (max-width: 980px) {
  .box-form {
    width: 90%; /* Make the form take up more of the viewport on small screens */
  }
}

/* Ensure no scrolling on body or html */
body, html {
  overflow: hidden;
  margin: 0;
  height: 100%;
}
</style>