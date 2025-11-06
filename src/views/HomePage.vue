<template>
  <div class="landing-container">
    <div class="logo-container">
      <div class="logo-text">
        #1 Best Finds Spreadsheet
      </div>
    </div>

    <div class="coupon-badge">
      🎉 Exclusive Welcome Bonus
    </div>

    <h1 class="main-title">
      GET $400 IN<br>WELCOME COUPONS
    </h1>

    <div class="cta-buttons">
      <a href="https://mulebuy.com/register?ref=200547927" class="btn btn-primary" target="_blank" @click="trackSignup">
        SIGN UP FOR $400 COUPONS
      </a>
      <router-link to="/products" class="btn btn-secondary">
        BROWSE PRODUCTS
      </router-link>
    </div>
  </div>
</template>

<script setup>
const trackSignup = () => {
  console.log('Sign up button clicked')
  // You can add analytics tracking here if needed
}
</script>

