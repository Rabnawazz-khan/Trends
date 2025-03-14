import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

import { getFirestore, collection, addDoc, getDocs} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDtmKyQvGpWKvGcydGuScsFDGH08ZOa0xs",
    authDomain: "first-project-1fa98.firebaseapp.com",
    projectId: "first-project-1fa98",
    storageBucket: "first-project-1fa98.firebasestorage.app",
    messagingSenderId: "352427913276",
    appId: "1:352427913276:web:f47f562533d241f3dc9339"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



// Login Function
async function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "products.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Signup Function
async function signup(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        await auth.signOut(); // Logout the user after signup
        alert("Signup successful! Please login to continue.");
        window.location.href = "index.html";  // Redirect to login page
    } catch (error) {
        alert("Error: " + error.message);
    }
}


// Logout
async function logout() {
  try {
      await signOut(auth);
      alert('Logged out successfully!');
      window.location.href = "index.html"; // Redirect to login page
  } catch (error) {
      alert("Error: " + error.message);
  }
}

// Track the auth state and redirect accordingly
onAuthStateChanged(auth, (user) => {
  if (!user) {
      // If the user is not logged in, redirect to the login page
      window.location.href = "index.html";
  }
});




// Export Functions to Window
window.login = login;
window.signup = signup;
window.logout = logout;



const productsContainer = document.getElementById('products-container');
if (productsContainer) {
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      productsContainer.innerHTML += `
        <div class="product">
          <img src="${product.imageUrl}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.price}</p>
          <button onclick="addToCart('${doc.id}')">Add to Cart</button>
          <button onclick="addToFavorites('${doc.id}')">❤️</button>
        </div>
      `;
    });
  };
  fetchProducts();
}

const productForm = document.getElementById('product-form'); 
if (productForm) {
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const imageUrl = document.getElementById('product-image').value;
    
    const productsContainer = document.getElementById('products-container');

    // Try adding the product
    try {
      // addDoc returns a DocumentReference, which contains the new document's ID.
      const docRef = await addDoc(collection(db, 'products'), {
        name: name,
        price: price,
        imageUrl: imageUrl
      });
      alert('Product added successfully!');
      productForm.reset(); // Clear the form

      // Immediately update the UI by appending the new product
      if (productsContainer) {
        productsContainer.innerHTML += `
          <div class="addToFavorites">
            <img src="${imageUrl}" alt="${name}">
            <h3>${name}</h3>
            <p>${price}</p>
            <button onclick="addToCart('${docRef.id}')">Add to Cart</button>
            <button onclick="addToFavorites('${docRef.id}')">❤️</button>
          </div>
        `;
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert('Failed to add product.');
      return; // Stop further execution if adding fails
    }
  });
}


window.addToCart = (productId) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      // Increase quantity if the product is already in the cart
      existingItem.quantity += 1;
    } else {
      // Add new product with quantity 1
      cart.push({ id: productId, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
  };



  window.addToFavorites = (productId) => {
    let favorites = JSON.parse(localStorage.getItem('Favorites')) || [];

    // Check if the product is already in favorites
    const existingItem = favorites.find(item => item.id === productId);

    if (!existingItem) {
        // Add the product to favorites if not already there
        favorites.push({ id: productId, quantity: 1 });
        localStorage.setItem('Favorites', JSON.stringify(favorites));
        alert('Product added to favorites!');
    } else {
        alert('This product is already in your favorites.');
    }
};


const favoritesContainer = document.getElementById('favorites-container');
if (favoritesContainer) {
  const fetchFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('Favorites')) || [];

    if (favorites.length > 0) {
      favoritesContainer.innerHTML = ''; // Clear the container before adding new items

      favorites.forEach((item) => {
        // Firestore se product details fetch karna
        getDoc(doc(db, 'products', item.id)).then((docSnap) => {
          if (docSnap.exists()) {
            const product = docSnap.data();
            favoritesContainer.innerHTML += `
              <div class="favorites-product">
                <img src="${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
              </div>
            `;
          } else {
            console.log('Product not found in Firestore:', item.id);
          }
        }).catch((error) => {
          console.error("Error fetching product from Firestore:", error);
        });
      });
    } else {
      favoritesContainer.innerHTML = '<p>No favorite products found.</p>';
    }
  };

  fetchFavorites(); // Call the function to display favorites
}


