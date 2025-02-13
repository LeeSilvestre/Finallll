<template>
  <div class="top-container">
    <h1 class="bg-title">Inventory</h1>
    <div class="old">
      <span class="text">Inventory</span>
      <i class="fas fa-box"></i>
      <hr />
    </div>
  </div>
  
  <div class="patients-list-container">
    
    <table class="patients-table">
      <thead>
        <tr>
          <!-- <th>NO.</th> -->
          <th>GENERIC NAME</th>
          <th>BRAND NAME</th>
          <th>ON-HAND STOCKS</th>
          <th>HALF</th>
          <th>STATUS</th>
          <th>USED</th>
          <th>ACTION</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in inventory" :key="item.vaccine_id">
          <!-- <td>{{ index + 1 }}</td> -->
          <td>{{ item.generic_name }}</td>
          <td>{{ item.brand_name }}</td>
          <td>{{ Math.floor(item.hand_stocks) }}</td>
          <td>
            <span v-if="item.halfed === 1" class="badge green">AVAILABLE</span>
            <span v-else>-</span>
          </td>
          <td>
            <span v-if="item.is_expired === 1" class="badge yellow-orange">EXPIRING</span>
            <span v-else-if="item.is_expired === 2" class="badge red">EXPIRED</span>
            <span v-else>-</span>
          </td>
          <td>{{ item.used_today }}</td>
          <td>
            <button @click="openEditModal(item)" class="export-button">Use</button>
            <button @click="openProcurementModal(item)" class="export-button">Re-Stock</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Procurement Modal -->
  <div class="modal" v-if="showProcurementModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>VACCINE PROCUREMENT</h2>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>GENERIC NAME:</label>
          <input type="text" v-model="selectedItem.generic_name" disabled>
        </div>

        <div class="form-group">
          <label>BRAND NAME:</label>
          <input type="text" v-model="selectedItem.brand_name" disabled>
        </div>

        <div class="form-group">
          <label>CURRENT HAND STOCKS:</label>
          <input type="text" v-model="selectedItem.hand_stocks" disabled>
        </div>

        <div class="form-group">
          <label>NEW HAND STOCKS:</label>
          <input type="number" v-model="newHandStocks" min="1" required>
        </div>

        <div class="button-group">
          <button @click="submitProcurement" class="submit-button">SUBMIT</button>
          <button @click="closeProcurementModal" class="cancel-button">CANCEL</button>
        </div>
      </div>
    </div>
  </div>

    <!-- Edit Modal -->
  <div class="modal" v-if="showEditModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>VACCINE USAGE</h2>
      </div>
      <div class="form-grid">
        <!-- Generic Name (Read-only) -->
        <div class="form-group">
          <label>GENERIC NAME:</label>
          <input type="text" v-model="selectedItem.generic_name" disabled>
        </div>

        <!-- Brand Name (Read-only) -->
        <div class="form-group">
          <label>BRAND NAME:</label>
          <input type="text" v-model="selectedItem.brand_name" disabled>
        </div>

        <!-- Available Hand Stocks (Read-only) -->
        <div class="form-group">
          <label>AVAILABLE HAND STOCKS:</label>
          <input type="text" v-model="selectedItem.hand_stocks" disabled>
        </div>

        <!-- Amount to Use (Editable) -->
        <div class="form-group">
          <label>HAND STOCKS TO USE:</label>
          <input type="number" v-model="amountToUse" min="0" required>
        </div>

        <!-- Buttons -->
        <div class="button-group">
          <button @click="submitUsage" class="submit-button">SUBMIT</button>
          <button @click="closeEditModal" class="cancel-button">CANCEL</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Daily Usage Table -->
  <div class="patients-list-container">
    <h2>DAILY USAGE</h2>
    <div class="date-filter">
      <input 
        type="date" 
        v-model="selectedDate"
        :max="minDate"
        class="border p-2 rounded"
        @change="filterRecords"
      />
      <button @click="clearDate" class="all-button">All</button>
    </div>
    <br>
    <table class="patients-table">
      <thead>
        <tr>
          <th>NO.</th>
          <th>DATE</th>
          <th>ON-HAND STOCKS USED</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(usage, index) in filteredDailyUsage" :key="usage.id">
          <td>{{ index + 1 }}</td>
          <td>{{ formatDate(usage.date_used) }}</td>
          <td>{{ usage.stocks_used }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'InventoryList',
  data() {
    return {
      selectedDate: "",
      currentPage: 1,
      rowsPerPage: 10,
      inventory: [],
      dailyUsage: [],
      allDailyUsage: [],
      showEditModal: false,
      selectedItem: {},
      amountToUse: 0,
      showProcurementModal: false,
      newHandStocks: 0
    };
  },
  mounted() {
    this.fetchInventory();
    this.fetchDailyUsage();
    this.selectedDate = "";
  },
  computed: {
    minDate() {
      const today = new Date();
      return today.toISOString().split("T")[0];
    },
    filteredDailyUsage() {
      if (!this.selectedDate) {
        return this.allDailyUsage; // Show all records
      }
      return this.allDailyUsage.filter(usage => usage.date_used == this.selectedDate);
    }
  },
  methods: {
    async submitProcurement() {
  if (this.newHandStocks <= 0) {
    Swal.fire('Error', 'Please enter a valid amount for procurement.', 'error');
    return;
  }

  try {
    // Parse the current hand_stocks to a float and add the newHandStocks to it.
    const currentHandStocks = parseFloat(this.selectedItem.hand_stocks); // Convert current hand_stocks to float
    const updatedHandStocks = currentHandStocks + parseFloat(this.newHandStocks); // Add new hand_stocks to current stocks

    // Make sure the new hand_stocks value is valid (not less than current)
    if (updatedHandStocks <= currentHandStocks) {
      Swal.fire('Error', 'New hand stocks must be greater than current hand stocks.', 'error');
      return;
    }

    // Send the PUT request to update the inventory on the backend
    await axios.put(`http://127.0.0.1:8000/api/inventory/${this.selectedItem.vaccine_id}`, {
      hand_stocks: updatedHandStocks,
    });

    // Display success message
    Swal.fire('Success', 'Re-stock successfully updated!', 'success');
    
    // Fetch the updated inventory and close the modal
    this.fetchInventory();
    this.closeProcurementModal();
  } catch (error) {
    console.error('Error updating procurement:', error);
    Swal.fire('Error', 'Failed to update procurement.', 'error');
  }
},
    openProcurementModal(item) {
      this.selectedItem = { ...item }; // Copy item details
      this.newHandStocks = 0;
      this.showProcurementModal = true;
    },
    closeProcurementModal() {
      this.showProcurementModal = false;
    },
    openEditModal(item) {
      this.selectedItem = { ...item }; // Copy item details
      this.amountToUse = 0;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    async submitUsage() {
      if (this.amountToUse <= 0) {
        Swal.fire('Error', 'Please enter a valid amount to use.', 'error');
        return;
      }
      if (this.amountToUse > this.selectedItem.hand_stocks) {
        Swal.fire('Error', 'Not enough hand stocks available.', 'error');
        return;
      }
      try {
        const response = await axios.post(`http://127.0.0.1:8000/api/inventory/decrease/${this.selectedItem.vaccine_id}`, {
          amount: this.amountToUse
        });
        Swal.fire('Success', response.data.message, 'success');
        this.fetchInventory();
        this.closeEditModal();
      } catch (error) {
        Swal.fire('Error', 'Failed to update inventory.', 'error');
      }
    },
    clearDate() {
      this.selectedDate = "";
      this.dailyUsage = this.allDailyUsage; // Reset to show all
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    },
    async fetchInventory() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/inventory');
        this.inventory = response.data;
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    },
    async fetchDailyUsage() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/usage');
        this.allDailyUsage = response.data;
        this.dailyUsage = response.data; // Default display
      } catch (error) {
        console.error('Error fetching daily usage:', error);
      }
    },
    filterRecords() {
      this.dailyUsage = this.filteredDailyUsage;
    }
  }
};
</script>


<style scoped>
.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}
.green {
  background-color: #28a745;
  color: white;
}
.yellow-orange {
  background-color: #ffae42;
  color: black;
}
.red {
  background-color: #dc3545;
  color: white;
}
.patients-tables-container {
  display: flex;
  flex-direction: column; /* Aligns table and pagination vertically */
  justify-content: space-between;
  margin-left: 2%;
  margin-right: 0.5%;
  margin-top: 10px;
}
.date-filter {
  display: flex;
  align-items: center;
  gap: 2px; /* Adds 2px spacing between buttons */
  margin: 0 auto;
  width: 10%;
}

.all-button {
  margin-left: 0;
  background-color: #188754;
  color: white;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 5px;
}

.all-button:hover {
  background-color: #0f6c44;
}
.yelloworange {
  background-color: #FFB600; /* Yellow-orange */
}
.green {
  background-color: #00FF00; /* Green */
}
.red {
  background-color: #FF0000; /* Red */
}
.export-button {
margin-left: auto;
margin-right: 10px;
background-color: #188754;
color: white;
border: none;
padding: 10px 20px;
cursor: pointer;
font-family: 'Product Sans', sans-serif;
border-radius: 5px;
}
.search-container {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 400px;
}

.search-bar {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem; /* Adjust padding to fit the icon */
  box-sizing: border-box;
  margin-left: 50px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add shadow effect */
  transition: box-shadow 0.3s; /* Add transition for hover effect */
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: black;
  margin-left: 20px;
}
.bg-title {
z-index: -1;
position: absolute;
opacity: 10%;
top: 0;
right: 0;
margin: 0;
font-size: 100px;
font-family: Impact, fantasy;
margin-right: 10px;
}
.top-container {
display: flex;
margin: 0.5rem;
padding-top: 2%;
position: relative;
}

.content{
margin-top: 50px;
}

.old {
display: flex;
align-items: center;
flex: 1;
}

.old .text {
margin-left: 1rem;
color: var(--dark);
font-size: 1.5rem;
font-weight: 900;
}

.old i {
color: var(--dark);
font-size: 3rem;
position: relative;
}
hr {
flex-basis: 100%;
border: none;
border-top: 1px solid #ddd;
margin: 2.5rem 0 0 0;
}
.patient-info-wrapper {
display: flex;
flex-direction: column;
}
.id-info { 
margin-top: 10px;
display: flex;
flex-direction: column;
}
.id-info div {
margin-top: 5px; /* Adjust spacing between IDs */
}
.text-info {
flex-basis: 100%;
}
.image-container {
display: flex;
align-items: center;
}
.image-container {
width: 150px; /* Adjust width as needed */
height: auto; /* Adjust height as needed */
overflow: hidden;
justify-content: flex-start;
flex-direction: column;
margin-right: 10px;
}

.patient-image {
width: 100%; /* Make the image fill its container */
height: auto; /* Maintain aspect ratio */
}
.patients-container {
display: flex;
flex-wrap: wrap;
font-family: 'Product Sans', sans-serif;
justify-content: center;
}

.patient-box {
width: 40%; /* Each box takes up 50% of the container width */
padding: 10px;
box-sizing: border-box; /* Include padding in the width calculation */
margin-left: 20px;
margin-top:20px;
border-style: solid;
border-color: #169d53;
border-width: 1px 1px 1px 6px;
border-radius: 10px;
}

.patient-info {
display: flex;
align-items: flex-start;
border-radius: 5px;
padding: 10px;
margin-bottom: 10px;
background-color: white;
text-align: left;
}
@media (max-width: 768px) {
.patients-container {
  display: flex;
  justify-content: center;
}
}

.edit-button-container {
align-self: flex-end;
font-family: 'Product Sans', sans-serif;
}
.modal {
display: flex;
align-items: center;
justify-content: center;
position: fixed;
z-index: 1;
left: 0;
top: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
font-family: 'Product Sans', sans-serif;
}

.modal-content {
background-color: #fff;
padding: 20px;
border-radius: 8px;
box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
max-width: 400px; /* Adjust the maximum width as needed */
width: 100%;
font-family: 'Product Sans', sans-serif;
position: relative;  /* Ensures close button is positioned relative to modal content */
text-align: left;
}

.close {
position: absolute;
top: 10px;
font-family: 'Product Sans', sans-serif;
cursor: pointer;
}

.close:hover {
color: #333; /* Change color on hover if desired */
}

.submit-button {
background-color: #188754;
color: white;
padding: 10px 20px;
border: none;
border-radius: 5px;
font-family: 'Product Sans', sans-serif;
cursor: pointer;
}

.submit-button:hover {
background-color: #0f6c44;
}

.add-button {
margin-left: auto;
margin-right: 10px;
background-color: #188754;
color: white;
border: none;
padding: 10px 20px;
cursor: pointer;
font-family: 'Product Sans', sans-serif;
border-radius: 5px;
}

.add-button:hover {
background-color: #0f6c44;
}

.edit-button {
margin-left: auto;
margin-right: 10px;
background-color: #188754;
color: white;
border: none;
padding: 10px 20px;
cursor: pointer;
border-radius: 5px;
font-family: 'Product Sans', sans-serif;
}

.edit-button:hover{
background-color: #0f6c44;
}
.patients-list-container {
padding: 20px;
font-family: 'Product Sans', sans-serif;
}
/* Pagination Styles */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* Spacing between pagination buttons */
  width: 100%; /* Ensures it takes full width of container */
  margin-bottom: 20px;
}

.pagination button {
  padding: 8px 12px;
  border: none;
  background-color: #188754;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background-color: #d6f6d5; /* Darker blue on hover */
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
  font-size: 1rem;
}

.title-container {
display: flex;
align-items: center;
font-family: 'Product Sans', sans-serif;
}

.title-container i {
margin-right: 20px; /* Adjust this value as needed */
}

.title {
margin-left: 10px; 
}

.table-container {
overflow-x: auto;
text-align: center;
border-style: solid;
border-color: #169d53;
}
.table-container {
  flex: 1;
  overflow-x: auto;
}

.form-columns {
display: flex;
}

.form-column {
flex: 1;
padding-right: 20px;
font-family: 'Product Sans', sans-serif;
}

.form-columns {
display: flex;
font-family: 'Product Sans', sans-serif;
}

.form-column {
flex: 1;
padding-right: 20px;
font-family: 'Product Sans', sans-serif;
}

.form-group {
margin-bottom: 20px;
font-family: 'Product Sans', sans-serif;
}

.label {
font-weight: bold;
margin-bottom: 5px;
display: block;
font-family: 'Product Sans', sans-serif;
}

input[type="text"],
input[type="email"],
input[type="password"],
select {
width: 100%;
padding: 10px;
border: 1px solid #ccc;
border-radius: 5px;
box-sizing: border-box;
font-family: 'Product Sans', sans-serif;
}

select {
appearance: none;
-webkit-appearance: none;
-moz-appearance: none;
background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 9 12 15 18 9"></polygon></svg>');
background-repeat: no-repeat;
background-position: right 10px center;
background-size: 14px;
}

input[type="date"] {
width: 100%;
padding: 10px;
border: 1px solid #ccc;
border-radius: 5px;
box-sizing: border-box;
appearance: none;
font-family: 'Product Sans', sans-serif;
}

.button-group {
display: flex;
justify-content: flex-end;
margin-top: 20px;
font-family: 'Product Sans', sans-serif;
}

.cancel-button,
.submit-button {
padding: 10px 20px;
border: none;
border-radius: 5px;
cursor: pointer;
transition: background-color 0.3s;
font-family: 'Product Sans', sans-serif;
}

.cancel-button {
background-color: #ccc;
color: #333;
font-family: 'Product Sans', sans-serif;
}

.submit-button {
background-color: #188754;
color: white;
font-family: 'Product Sans', sans-serif;
}

.submit-button:hover {
background-color: #0f6c44;
}
table {
width: 100%;
border-collapse: collapse;
font-family: 'Product Sans', sans-serif;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

th {
background-color: #169d53;
color: white;
}
</style>