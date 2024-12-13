
import { auth, createUserWithEmailAndPassword, db, collection, addDoc, signInWithPopup,  signOut } from "./firebase.js";

// === Register with Email and Password ===
let registerBtn = document.getElementById("register-btn");
if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (email === "" || password === "") {
      alert("Please enter both email and password.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User registered:", user);
        alert("Registration successful!");
        // Redirect to dashboard with the email as a query parameter
        window.location.href = `dashboard.html?email=${encodeURIComponent(user.email)}`;
      })
      .catch((error) => {
        console.error("Error:", error.code, error.message);
        alert("Registration failed: " + error.message);
      });
  });
}

// === Google Sign-In ===
let googleSignInBtn = document.getElementById("google-sign-in-btn");
if (googleSignInBtn) {
  googleSignInBtn.addEventListener("click", () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        console.log("User signed in with Google:", user);
        alert("Google sign-in successful!");
        // Redirect to dashboard with the email as a query parameter
        window.location.href = `dashboard.html?email=${encodeURIComponent(user.email)}`;
      })
      .catch((error) => {
        console.error("Error during Google sign-in:", error.message);
        alert("Google sign-in failed. Please try again.");
      });
  });
}

// === Blog Save ===

const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const displayName = email ? email.replace("@gmail.com", "") : "User";
    const welcomeMessage = document.getElementById("welcome-message");
    welcomeMessage.textContent = `Welcome, ${displayName}!`;

    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn.addEventListener("click", () => {
      alert("You have been logged out.");
      window.location.href = "index.html"; // Redirect to the login page
    });

    // Function to fetch blogs from localStorage
    // Function to fetch blogs from localStorage
function fetchBlogs() {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = ""; // Clear existing blogs

  const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

  blogs.forEach((blog, index) => {
    // Remove "@gmail.com" from the author email
    const authorName = blog.author.replace("@gmail.com", "");

    const blogElement = document.createElement("div");
    blogElement.classList.add("post", "mb-4", "p-3", "border", "rounded");

    blogElement.innerHTML = `
      <h3 class="blog-title">${blog.title}</h3>
      <p class="blog-content">${blog.content}</p>
      <small class="text-muted">Posted on ${blog.time} by ${displayName}</small>
      <br>
      <button class="btn btn-outline-primary btn-sm" onclick="editBlog(${index})">Edit</button>
      <button class="btn btn-primary btn-sm" onclick="deleteBlog(${index})">Delete</button>
    `;

    postsContainer.appendChild(blogElement);
  });
}

    // Function to save new or updated blog to localStorage
    function saveBlog(title, content, index = null) {
      let blogs = JSON.parse(localStorage.getItem("blogs")) || [];
      const newBlog = {
        title: title,
        content: content,
        time: new Date().toLocaleString(),
        author: displayName
      };

      if (index !== null) {
        blogs[index] = newBlog; // Update existing blog
      } else {
        blogs.push(newBlog); // Add new blog
      }

      localStorage.setItem("blogs", JSON.stringify(blogs));
      alert(index !== null ? "Blog updated successfully!" : "Blog saved successfully!");
      $('#addBlogModal').modal('hide'); // Close modal
      fetchBlogs(); // Re-fetch and display blogs
    }

    // Blog form submission
    document.getElementById("blogForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("blogTitle").value;
      const content = document.getElementById("blogContent").value;

      if (title.trim() === "" || content.trim() === "") {
        alert("Please fill in all fields.");
        return;
      }

      saveBlog(title, content, window.editIndex); // If `editIndex` is set, it's an update; otherwise, it's new
      document.getElementById("blogForm").reset(); // Reset form
    });

    // Edit a blog
    function editBlog(index) {
      const blogs = JSON.parse(localStorage.getItem("blogs"));
      const blog = blogs[index];
      document.getElementById("blogTitle").value = blog.title;
      document.getElementById("blogContent").value = blog.content;
      window.editIndex = index; // Store index for updating
      $('#addBlogModal').modal('show'); // Show modal
      document.querySelector(".modal-title").textContent = "Edit Blog"; // Change modal title
    }

    // Delete a blog
    function deleteBlog(index) {
      const blogs = JSON.parse(localStorage.getItem("blogs"));
      blogs.splice(index, 1); // Remove blog at index
      localStorage.setItem("blogs", JSON.stringify(blogs));
      alert("Blog deleted successfully!");
      fetchBlogs(); // Re-fetch and display blogs
    }

    // Fetch blogs on page load
    window.onload = fetchBlogs;



    document.getElementById("blogForm").addEventListener("submit", async (e) => {
        e.preventDefault();
      
        // Get title and content from the form
        const title = document.getElementById("blogTitle").value;
        const content = document.getElementById("blogContent").value;
      
        // Check if fields are not empty
        if (title.trim() === "" || content.trim() === "") {
          alert("Please fill in all fields.");
          return;
        }
      
        // Get the currently logged-in user's email
        const user = auth.currentUser;
      
        // If no user is logged in, show an error
        if (!user) {
          alert("You need to log in to create a blog.");
          return;
        }
      
        // Extract the display name from the email (remove "@gmail.com")
        const displayName = user.email.replace("@gmail.com", "");
      //   const displayName = user.email.replace("@gmail.com", "");
      
        // Log for debugging
        console.log("Display Name: ", displayName);
        console.log("User Email: ", user.email);
        try {
          // Save blog to Firestore "blog" collection
          const blogRef = collection(db, "blogs");
          await addDoc(blogRef, {
            title: title,
            content: content,
            createdAt: new Date(),
            author: authorName // Store the display name without "@gmail.com"
          });
      
          alert("Blog saved successfully!");
      
          // Close the modal
          $('#addBlogModal').modal('hide');
      
          // Reset the form fields
          document.getElementById("blogForm").reset();
        } catch (error) {
          console.error("Error adding document: ", error);
          alert("Failed to save blog. Please try again.");
        }
      });
