<script>
  import { initializeApp } from 'firebase/app';
  import { getDatabase, ref, push, onValue, update } from 'firebase/database';
  import { onMount } from 'svelte';
  import html2canvas from 'html2canvas';

  let codeSnippets = [];
  let newSnippetTitle = '';
  let newSnippetCode = '';
  let selectedIcon = '';

 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCF5YRke_9RzuQOONX1vFB05xH8PngENqc",
  authDomain: "svelte-forever.firebaseapp.com",
  databaseURL: "https://svelte-forever-default-rtdb.firebaseio.com",
  projectId: "svelte-forever",
  storageBucket: "svelte-forever.appspot.com",
  messagingSenderId: "226934196830",
  appId: "1:226934196830:web:b6b49ea005be128a26c2cf",
  measurementId: "G-Y492VJ0ZMC"
};

  const firebaseApp = initializeApp(firebaseConfig);
  const db = getDatabase(firebaseApp);

  onValue(ref(db, 'codeSnippets'), (snapshot) => {
    const data = snapshot.val();
    codeSnippets = Object.values(data || {});
  });

  function addSnippet() {
    if (newSnippetTitle && newSnippetCode && selectedIcon) {
      const newSnippet = {
        title: newSnippetTitle,
        code: newSnippetCode,
        icon: selectedIcon,
        likes: 0
      };

      const newSnippetRef = push(ref(db, 'codeSnippets'));
      const newSnippetId = newSnippetRef.key;

      newSnippet.id = newSnippetId;

      update(newSnippetRef, newSnippet);

      newSnippetTitle = '';
      newSnippetCode = '';
      selectedIcon = '';
    } else {
      alert("Please choose a type and title for your snippet!");
    }
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code)
      .then(() => {
        alert('Snippet copied to clipboard');
      })
      .catch((error) => {
        console.error('Failed to copy code: ', error);
      });
  }

  function likeSnippet(snippet) {
    const snippetId = snippet.id;
    const snippetRef = ref(db, `codeSnippets/${snippetId}`);
    const currentLikes = snippet.likes || 0;
    const newLikes = currentLikes + 1;

    try {
      update(snippetRef, { likes: newLikes });
      console.log("Likes updated successfully for snippet with ID:", snippetId);
      snippet.likes = newLikes;
    } catch (error) {
      console.error("Error updating likes for snippet with ID:", snippetId, error);
    }
  }

  function shareSnippet(snippet) {
    if (navigator.share) {
      navigator.share({
          title: snippet.title,
          text: snippet.code,
      })
      .then(() => {
          console.log('Snippet shared successfully');
      })
      .catch((error) => {
          console.error('Error sharing snippet:', error);
          // Fallback behavior
          displayManualSharePrompt(snippet);
      });
    } else {
      // Fallback behavior
      displayManualSharePrompt(snippet);
    }
  }

  function displayManualSharePrompt(snippet) {
    // Fallback behavior: Display a prompt with the snippet details for manual sharing
    alert("Snippit '" + snippet.title + "', copy the following code: \n\n" + snippet.code);
  }

  function takeScreenshot(snippetId) {
    const snippetContainer = document.querySelector(`#snippet-${snippetId}`);

    if (snippetContainer) {
      html2canvas(snippetContainer)
          .then(canvas => {
              const dataUrl = canvas.toDataURL();
              downloadScreenshot(dataUrl, `snippet-screenshot-${snippetId}.png`);
          })
          .catch(error => {
              console.error('Failed to take screenshot:', error);
          });
    } else {
      console.error('Snippet container not found.');
    }
  }

  function downloadScreenshot(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }
</script>

<main>
  <h1>Welcome to Snippitz!</h1>
  <button on:click="{() => document.body.classList.toggle('light-theme')}">Toggle Theme</button>
   <section>
    <h2><code>SHARE. YOUR. CODE.</code></h2>
    <div>
      <label for="snippetTitle"><code>create snippit</code></label>
      <select id="iconSelect" bind:value={selectedIcon}>
        <option value="">language</option>
        <option value="snip.svg">Plain Text</option>
        <option value="css.svg">CSS</option>
        <option value="html.svg">HTML</option>
        <option value="svelte.svg">Svelte</option>
        <option value="rust.svg">Rust</option>
        <option value="react.svg">ReactJS</option>
        <option value="js.svg">VanilliaJS</option>
        <option value="nextjs.svg">NextJS</option>
        <option value="tailwind.svg">Tailwind CSS</option>
        <option value="ts.svg">typescript</option>
        <option value="tailwind.svg">Tailwind CSS</option>
        <option value="json.svg">JSON</option>
        <option value="link.svg">http</option>
      </select>
      <input type="text" id="snippetTitle" placeholder="name" bind:value={newSnippetTitle}>
      <textarea id="snippetCode" rows="5" placeholder="share your code" bind:value={newSnippetCode}></textarea>
      <button on:click={addSnippet}>Snippit!</button>
      {#if newSnippetTitle && newSnippetCode && selectedIcon}
       <p class="reminder"><img src="./police.svg" alt="Police Icon">community guidelines</p>
      {/if}
    </div>
  </section>
<section>
  <h2>Shared Snippets</h2>
  <div class="snippet-container">
    {#each codeSnippets as snippet}
      <div class="snippet" id={`snippet-${snippet.id}`}>
        <h3 class="snippet-title">
          {#if snippet.icon}
            <!-- Update src attribute to correctly point to the SVG icon -->
           <img src={`https://bucket.jessejesse.com/icons/${snippet.icon}`} alt="Snippet Icon" />
          {/if}
          {snippet.title}
          <div class="like-section">
            <!-- Like button -->
            <img class="like-icon" src="https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/icons%2Flike.svg" alt="Like Icon" on:click={() => likeSnippet(snippet)} />
            <span class="like-count">{snippet.likes || 0}</span>
          </div>
        </h3>
        <div class="code-wrapper" style="white-space: pre-wrap;">
          <pre class="code-snippet"><code class="language-javascript">{snippet.code}</code></pre>
          <div class="button-container">
            <button class="bn3" on:click={() => copyCode(snippet.code)}>copy</button>
            <button class="share-button" on:click={() => shareSnippet(snippet)}>share</button>
            <button class="photo-button" on:click={() => takeScreenshot(snippet.id)}>screenshot</button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>


</main>

<footer class="footer">
  <a href="https://snippitz.vercel.app" target="_blank" rel="noopener noreferrer">Snippitz&nbsp;&#10084;&nbsp;SvelteKit</a>
</footer>
<style>
 
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Courier New', Courier, monospace;
    background-color: #1a1a1a;
    color: #fff;
  }

  .light-theme {
    background-color: #fff;
    color: #333;
  }

  #iconSelect {
    width: 200px;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #444;
    border-radius: 5px;
    background-color: #333;
    color: #fff;
  }

  #snippetTitle {
    width: 50%;
  }
  
  section {
    margin-bottom: 30px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    color: #fff;
  }

  input, textarea, select {
    width: calc(100% - 22px);
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #444;
    border-radius: 5px;
    resize: vertical;
    background-color: #333;
    color: #fff;
  }

  button {
    padding: 10px 20px;
    background-color: #333;
    color: #fff;
    border: 3px;
    border-color: #fff;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #444;
  }

  pre, .snippet, .snippet-container, .code-snippet {
    background-color: #222;
    border-radius: 5px;
    color: #fff;
  }

  img {
    max-width: 50px;
    max-height: 50px;
  }

  .snippet {
    margin-bottom: 20px;
    border: 3px solid #444;
    border-radius: 5px;
    padding: 10px;
    background-color: #1a1a1a;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a shadow effect */
  }

  .snippet-container {
    position: relative;
    background-color: #333;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
  }

  .code-wrapper {
    position: relative;
    max-width: 100%;
    overflow-x: auto;
  }

  .button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px; /* Add some margin to separate the buttons from the code snippet */
}

/* Remove absolute positioning for individual buttons */
.bn3,
.share-button,
.photo-button {
  position: relative;
  padding: 5px 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  color: #ffffff;
  text-shadow: 0 0.04em 0.04em rgba(255, 255, 255, 0.253);
  text-align: center;
  transition: all 0.2s;
}

/* Adjust button hover styles */
.bn3:hover,
.share-button:hover,
.photo-button:hover {
  color: black;
  background-color: rgb(255, 255, 255);
}



  .reminder {
    color: #6c757d;
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #222;
    padding: 10px 20px;
    text-align: center;
    color: #fff;
    font-size: 16px;
  }

  .footer a {
    color: #fff;
    text-decoration: none;
  }

  .footer a:hover {
    color: #ff6316;
    text-decoration: none;
  }

  .snippet-container {
    overflow-y: auto;
  }

  .strikethrough {
    text-decoration: line-through;
  }

  .snippet-title {
    display: flex;
    align-items: center;
  }

  .like-section {
    margin-left: auto;
    display: flex;
    align-items: center;
  }

  .like-icon {
    cursor: pointer;
    margin-right: 5px;
  }

  .like-count {
    margin-left: 5px;
    color: #c8ff00;
  }

</style>



