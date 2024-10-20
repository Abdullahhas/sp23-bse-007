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

const hovereff = ()=>{
  nameimage.forEach(element => {
    const a = element.querySelector('.products a')
    element.addEventListener('mouseover' , ()=>{
      const text = a.innerHTML;
      console.log(text)
    })
  });
}

hovereff()