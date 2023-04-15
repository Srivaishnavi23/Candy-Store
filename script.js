
  const BASE_URL = "https://crudcrud.com/api/a5f6a9cbf1d146c59621084cd9907d9c";

  // Load candy data on page load
  window.addEventListener("load", async () => {
    const response = await axios.get(`https://crudcrud.com/api/a5f6a9cbf1d146c59621084cd9907d9c/candy`);
    const candyData = response.data;
    candyData.forEach(addCandyRow);
  });
  
  

  // Add a new candy row to the table
  function addCandyRow(candy) {
    const candyTableBody = document.getElementById("candy-table-body");
    const row = candyTableBody.insertRow();
    row.insertCell().textContent = candy.name;
    row.insertCell().textContent = candy.description;
    row.insertCell().textContent = `$${candy.price.toFixed(2)}`;
    const quantityCell = row.insertCell();
    quantityCell.textContent = candy.quantity;
    quantityCell.id = `quantity-${candy._id}`;
    const actionCell = row.insertCell();
    actionCell.innerHTML = `
      <button class="buy-btn" type="button" onclick="buyCandy('${candy._id}', 1)">Buy 1</button>
      <button class="buy-btn" type="button" onclick="buyCandy('${candy._id}', 2)">Buy 2</button>
      <button class="buy-btn" type="button" onclick="buyCandy('${candy._id}', 3)">Buy 3</button>
      <button class="edit-btn" type="button" onclick="editCandy('${candy._id}')">Edit</button>
      <button class="delete-btn" type="button" onclick="deleteCandy('${candy._id}')">Delete</button>
    `;
  }
  function addToCart(candyIndex) {
    const candy = candies[candyIndex];
    const quantity = parseInt(document.getElementById(`quantity${candyIndex}`).value);
    if (quantity > 0 && candy.quantity >= quantity) {
      candy.quantity -= quantity;
      const cartItem = {
        candy: candy.name,
        quantity: quantity,
        price: candy.price,
        id: candy.id
      }
      cart.push(cartItem);
      saveCart();
      updateCart();
      updateCandyTable();
    }
  }
  

  // Add candy to the table and save it to the database
  async function addCandy(quantity) {
    const candyNameInput = document.getElementById("candy-name-input");
    const candyDescInput = document.getElementById("candy-desc-input");
    const candyPriceInput = document.getElementById("candy-price-input");

    const candy = {
      name: candyNameInput.value,
      description: candyDescInput.value,
      price: parseFloat(candyPriceInput.value),
      quantity: quantity
    };

    const response = await axios.post('https://crudcrud.com/api/a5f6a9cbf1d146c59621084cd9907d9c/candy`, candy);
    const addedCandy = response.data;

    addCandyRow(addedCandy);
  }

  // Save candy to the database
  async function saveCandy() {
    const candyIdInput = document.getElementById("candy-id-input");
    const candyNameInput = document.getElementById("candy-name-input");
    const candyDescInput = document.getElementById("candy-desc-input");
    const candyPriceInput = document.getElementById("candy-price-input");

    const candy = {
      name: candyNameInput.value,
      description: candyDescInput.value,
      price: parseFloat(candyPriceInput.value),
      quantity: 0
    };

    const response = await axios.post(`https://crudcrud.com/api/a5f6a9cbf1d146c59621084cd9907d9c/candy`, candy);
    const addedCandy = response.data;

    addCandyRow(addedCandy);
  }

    // Delete candy from the table and database
    async function deleteCandy(candyId) {
      const response = await axios.delete(`https://crudcrud.com/api/a5f6a9cbf1d146c59621084cd9907d9c/candy/643a79396246ac03e8533115`);
      const deletedCandy = response.data;
      const candyTableBody = document.getElementById("candy-table-body");
      const rows = candyTableBody.getElementsByTagName("tr");
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const quantityCell = row.querySelector(`#quantity-${candyId}`);
        if (quantityCell) {
          row.remove();
          break;
        }
      }
    }
  
    // Buy candy and update quantity in the table and database
    async function buyCandy(candyId, quantity) {
      const quantityCell = document.getElementById(`quantity-${candyId}`);
      const currentQuantity = parseInt(quantityCell.textContent);
      if (currentQuantity < quantity) {
        alert("Not enough candy in stock!");
        return;
      }
      const newQuantity = currentQuantity - quantity;
      quantityCell.textContent = newQuantity;
  
      const response = await axios.put(`https://crudcrud.com/api/a5f6a9cbf1d146c59621084cd9907d9c/candy/643a79396246ac03e8533115`, {
        quantity: newQuantity
      });
      const updatedCandy = response.data;
    }
  
    // Edit candy and save changes to the database
    async function editCandy(candyId) {
      const candyIdInput = document.getElementById("candy-id-input");
      candyIdInput.value = candyId;
      const candyNameInput = document.getElementById("candy-name-input");
      const candyDescInput = document.getElementById("candy-desc-input");
      const candyPriceInput = document.getElementById("candy-price-input");
  
      const candyRow = document.querySelector(`#quantity-${candyId}`).parentNode;
      candyNameInput.value = candyRow.cells[0].textContent;
      candyDescInput.value = candyRow.cells[1].textContent;
      candyPriceInput.value = parseFloat(candyRow.cells[2].textContent.substring(1)).toFixed(2);
  
      const saveBtn = document.getElementById("save-btn");
      saveBtn.disabled = false;
      saveBtn.onclick = async () => {
        const candy = {
          name: candyNameInput.value,
          description: candyDescInput.value,
          price: parseFloat(candyPriceInput.value),
          quantity: parseInt(candyRow.cells[3].textContent)
        };
  
        const response = await axios.put(https://crudcrud.com/api/a5f6a9cbf1d146c59621084cd9907d9c/candy/643a79396246ac03e8533115, candy);
        const updatedCandy = response.data;
  
        candyRow.cells[0].textContent = updatedCandy.name;
        candyRow.cells[1].textContent = updatedCandy.description;
        candyRow.cells[2].textContent = `$${updatedCandy.price.toFixed(2)}`;
      };
    }
  
    // Add extra rows to the table
    const addBtn = document.getElementById("add-btn");
    addBtn.onclick = () => {
      const candyQuantityInput = document.getElementById("candy-quantity-input");
      const quantity = parseInt(candyQuantityInput.value);
      if (quantity <= 0) {
        alert("Invalid quantity!");
        return;
      }
      addCandy(quantity);
      candyQuantityInput.value = "";
    };
  
  