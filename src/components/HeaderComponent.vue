<template>
    <header class="header-bar">
        <i class="fas fa-columns"></i>
      <div class="header-content">
        <h1></h1>
        <p>{{ currentDate }}</p>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'HeaderComponent',
    data() {
      return {
        currentDate: ''
      };
    },
    mounted() {
      this.updateTime();
      setInterval(this.updateTime, 1000);
    },
    methods: {
      updateTime() {
        const date = new Date();
        const options = { 
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
          hour: 'numeric', minute: 'numeric', second: 'numeric' 
        };
        this.currentDate = date.toLocaleDateString('en-US', options);
      }
    }
  };
  </script>
  
  <style scoped>
  .body{
margin-left: 10px;
  }
  .header-bar {
    display: flex;
    align-items: center;
    background-color: white;
    color: white;
    padding: 0px;
    text-align: center;
    width: 100%;
    height: auto;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .header-bar i { 
    font-size: 20px;
  }
  
  .header-bar .header-content {
    display: flex;
    justify-content: space-between;
    flex: 1;
    padding: 16px;
  }
  
  .header-bar h1 {
    margin: 0;
    font-size: 40px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .header-bar p {
    margin: 0;
    color: gray;
    font-size: 20px;
  }
  </style>
  