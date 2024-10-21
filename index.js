const products = document.querySelectorAll('.products'); 
let totalPrice = 0;

const calculatePrice = () => {
  products.forEach(product => { 
    const priceElement = product.querySelector('.price'); 
    product.addEventListener('click', () => {
      // Remove 'pkr ' and any commas from the price text
      const priceText = priceElement.innerHTML.replace('pkr ', '').replace(/,/g, '');
      const priceNumber = parseInt(priceText); // Parse the price as an integer
      totalPrice += priceNumber; // Add the price to totalPrice
      console.log(`totalPrice is ${totalPrice}`); // Log the total price
    });
  });
}

calculatePrice();


const nameimage =  document.querySelectorAll('.products')

const hovereff = () => {
  nameimage.forEach(element => {
    const a = element.querySelector('.products a'); // Select the <a> tag
    // const div = element.querySelector('.products div'); // Select the <div> tag

    element.addEventListener('mouseover', () => {
      if (a) {
        const aText = a.innerHTML; // Get the inner HTML of <a>
        console.log(`${aText}`);
      }
      // if (div) {
      //   const divText = div.innerHTML; // Get the inner HTML of <div>
      //   console.log(`${divText}`);
      // }
    });
  });
}

hovereff()