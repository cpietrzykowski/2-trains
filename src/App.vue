<template>
  <div id="app">
    <div id="heading">
      <h1><router-link :to="{name: 'Home'}">2 Trains</router-link></h1>
    </div>
    <div id="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

html {
  line-height: 1.5;
}

body {
  font-family: sans-serif;
  margin: 0;
}

#heading {
  text-align: center;
}

#heading > h1 {
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 2px 2px 8px 0 rgba(0,0,0,.25);
  padding: 0.5rem 2rem;
}

#heading > h1 > a {
  color: white;
  text-decoration: none;
}

#content {
  padding: 1rem;
}
</style>
