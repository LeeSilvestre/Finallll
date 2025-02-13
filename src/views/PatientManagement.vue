<template>
  <div class="top-container">
    <h1 class="bg-title">Patient Management</h1>
    <div class="patient">
      <span class="text">PatientManagement</span>
      <i class="fas fa-chart-bar"></i>
      <hr />
    </div>
  </div>
<div class="patients-list-container">
  <div class="title-container">
    <div class="search-container">
      <i class="fas fa-search search-icon"></i>
      <input type="text" v-model="searchQuery" placeholder="Search Patients" class="search-bar">
    </div>
    <button class="add-button" @click="showAddModal = true">Create Patient Account</button>
  </div>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>NO.</th>
          <th>NAME</th>
          <th>ADDRESS</th>
          <th>GENDER</th>
          <th>AGE</th>
          <th>CONTACT NUMBER</th>
          <th>EDIT</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(patient, index) in filteredPatients" :key="patient.id">
          <td>{{ index + 1 }}</td>
          <td>{{ fullName(patient) }}</td>
          <td>{{ patient.address }}</td>
          <td>{{ patient.sex === 'male' ? 'M' : 'F' }}</td>
          <td>{{ calculateAge(patient.birthdate) }}</td>
          <td>0{{ patient.contact }}</td>
          <td>
            <button class="edit-button" @click="editPatient(patient)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  </div>
  <!--EDIT MODAL-->
  <div class="modal" v-if="showEditModal">
    <div class="modal-content">
      <div class="modal-header">
      <h2>Edit Patient</h2>
      </div>
      <div class="form-columns">
        <!-- Left Column -->
        <div class="form-column">
          <div class="form-group">
            <label for="edited-fname">First Name</label>
            <input type="text" id="edited-fname" v-model="editedPatient.fname" required>
          </div>

          <div class="form-group">
            <label for="edited-lname">Last Name</label>
            <input type="text" id="edited-lname" v-model="editedPatient.lname" required>
          </div>
          <div class="form-group">
            <label for="edited-ddress">Address</label>
            <input type="text" id="edited-address" v-model="editedPatient.address" required>
          </div>
        </div>

        <!-- Right Column -->
        <div class="form-column">
          <div class="form-group">
            <label for="edited-mname">Middle Name</label>
            <input type="text" id="edited-mname" v-model="editedPatient.mname">
          </div>

          <div class="form-group">
            <label for="edited-extension">Extension</label>
            <input type="text" id="edited-extension" v-model="editedPatient.extension">
          </div>
          <div class="form-group">
            <label for="edited-contact">Contact Number</label>
            <input type="text" id="edited-contact" v-model="editedPatient.contact" required>
          </div>  
        </div>
      </div>

      <div class="button-group">
        <button type="submit" @click="submitEdit" class="submit-button">UPDATE</button>
        <button class="cancel-button" @click="showEditModal = false">CANCEL</button>
      </div>
    </div>
  </div>
  <!--ADD MODAL-->
 <div class="modal" v-if="showAddModal">
  <div class="modal-content">
        <div class="modal-header">
          <h2>NEW PATIENT ACCOUNT</h2>
        </div>
        <div class="form-grid">
          <!-- Row 1 -->
          <div class="form-group">
            <label for="fname">First Name <span class="required">*</span></label>
            <span class="error-message" v-if="errors.fname">{{ errors.fname }}</span>
            <input type="text" id="fname" v-model="newPatient.fname" required>
            
          </div>
      
          <div class="form-group">
            <label for="mname">Middle Name</label>
            <input type="text" id="mname" v-model="newPatient.mname">
          </div>
      
          <div class="form-group">
            <label for="lname">Last Name <span class="required">*</span></label>
            <span class="error-message" v-if="errors.lname">{{ errors.lname }}</span>
            <input type="text" id="lname" v-model="newPatient.lname" required>
           
          </div>
      
          <div class="form-group">
            <label for="extension">Suffix</label>
            <select id="extension" v-model="newPatient.extension">
              <option value="Jr.">Jr.</option>
              <option value="Sr.">Sr.</option>
              <option value="I">I</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
              <option value="V">V</option>
            </select>
          </div>
      
          <!-- Row 2 -->
          <div class="form-group">
            <label for="sex">Gender <span class="required">*</span></label>
            <span class="error-message" v-if="errors.sex">{{ errors.sex }}</span>
            <select id="sex" v-model="newPatient.sex" required>
              <option value="Male">male</option>
              <option value="Female">female</option>
            </select>
           
          </div>
      
          <div class="form-group">
            <label for="contact">Contact Number <span class="required">*</span></label>
            <span class="error-message" v-if="errors.contact">{{ errors.contact }}</span>
            <input type="text" id="contact" v-model="newPatient.contact" required>
     
          </div>

          <div class="form-group">
            <label for="address">Address (in Olongapo)<span class="required">*</span></label>
            <span class="error-message" v-if="errors.address">{{ errors.address }}</span>
            <select id="source" v-model="newPatient.address" required>
              <option value="Asinan">Asinan</option>
              <option value="Banicain">Banicain</option>
              <option value="Barretto">Barretto</option>
              <option value="New Cabalan">New Cabalan</option>
              <option value="Old Cabalan">Old Cabalan</option>
              <option value="East Bajac-Bajac">East Bajac-Bajac</option>
              <option value="East Tapinac">East Tapinac</option>
              <option value="Gordon Heights">Gordon Heights</option>
              <option value="New Ilalim">New Ilalim</option>
              <option value="New Kababae">New Kababae</option>
              <option value="Kalaklan">Kalaklan</option>
              <option value="New Kalalake">New Kalalake</option>
              <option value="Mabayuan">Mabayuan</option>
              <option value="Pag-Asa">Pag-Asa</option>
              <option value="Sta. Rita">Sta. Rita</option>
              <option value="West Bajac-Bajac">West Bajac-Bajac</option>
              <option value="West Tapinac">West Tapinac</option>
              <option value="Others">Others</option>
            </select>
            
          </div>
      
          <div class="form-group">
            <label for="birthdate">Birthdate <span class="required">*</span></label>
            <span class="error-message" v-if="errors.birthdate">{{ errors.birthdate }}</span>
            <input type="date" id="birthdate" v-model="newPatient.birthdate" required>            
          </div>
      
          <!-- Row 3 -->
          <div class="form-group">
            <label for="email">Email <span class="required">*</span></label>
            <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
            <input type="email" id="email" v-model="newPatient.email" required>
          </div>
          
          <div class="form-group">
            <label for="username">Username <span class="required">*</span></label>
            <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
            <input type="text" id="username" v-model="newPatient.username" required>
          </div>

          <div class="form-group">
            <label for="password">Password <span class="required">*</span></label>
            <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
            <input type="password" id="password" v-model="newPatient.password" required>
           
          </div>

          <div class="form-group">
            <label for="repassword">Re-Enter Password <span class="required">*</span></label>
            <span class="error-message" v-if="errors.repassword">{{ errors.repassword }}</span>
            <input type="password" id="repassword" v-model="newPatient.repassword" required>
       
          </div>
        </div>
  
      <div class="button-group">
        <button type="submit" @click=validateForm class="submit-button">SUBMIT</button>
        <button class="cancel-button" @click="showAddModal = false">CANCEL</button>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
export default {
  name: 'PatientsList',
  data() {
    return {
      patients: [],
      showAddModal: false,
      showEditModal: false,
      searchQuery: '',
      newPatient: { 
        fname: '',
        mname: '',
        lname: '',
        extension: '',
        address: '',
        sex: '',
        birthdate: '',
        contact: '',
        email: '',
        password: '',
        username: '',
        repassword: ''
      },
      editedPatient: {
        user_id: '',
        fname: '',
        mname: '',
        lname: '',
        extension: '',
        address: '',
        sex: '',
        contact: ''
      },
      errors: {} 
    };
  },
  mounted() {
    this.fetchPatients();
  },
  computed: {
    filteredPatients() {
      return this.patients.filter(patient => patient.is_verified == 1 && this.matchesSearchQuery(patient));
    }
  },
  methods: {
    validateForm() {
      this.errors = {}; // Clear previous errors

      // Required field checks
      if (!this.newPatient.fname) this.errors.fname = "First name is required.";
      if (!this.newPatient.lname) this.errors.lname = "Last name is required.";
      if (!this.newPatient.sex) this.errors.sex = "Gender is required.";
      if (!this.newPatient.address) this.errors.address = "Address is required.";
      if (!this.newPatient.contact) this.errors.contact = "Contact number is required.";
      if (!this.newPatient.birthdate) this.errors.birthdate = "Birthdate is required.";
      if (!this.newPatient.email) this.errors.email = "Email is required.";
      if (!this.newPatient.password) this.errors.password = "Password is required.";
      if (!this.newPatient.repassword) this.errors.repassword = "This is required.";

      // Password validation (must be at least 8 characters with one special character)
      const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      if (this.newPatient.password && !passwordRegex.test(this.newPatient.password)) {
        this.errors.password = "Password must be at least 8 characters and contain at least one special character.";
      }

      // Check if passwords match
      if (this.newPatient.password !== this.newPatient.repassword) {
        this.errors.repassword = "Passwords don't match.";
      }


      // If no errors, proceed to form submission
      if (Object.keys(this.errors).length === 0) {
        this.submitForm();
      }
    },
  
    matchesSearchQuery(patient) {
      const query = this.searchQuery.toLowerCase();
      return (
        this.fullName(patient).toLowerCase().includes(query) ||
        patient.address.toLowerCase().includes(query) ||
        patient.contact.toString().includes(query)
      );
    },
    calculateAge(birthdate) {
      if (!birthdate) return 'N/A'; // Handle missing or invalid birthdate
      const birthDateObj = new Date(birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
      }
      return age;
    },
    submitForm() {
      this.newPatient.is_verified = 1;
      axios.post('http://127.0.0.1:8000/api/user', this.newPatient)
        .then(response => {
          console.log('Patient added successfully:', response.data);
          this.showAddModal = false; // Close modal after successful submission
          this.fetchPatients(); // Fetch updated patient list
          // Reset form fields if needed
          this.newPatient = {
            fname: '',
            mname: '',
            lname: '',
            extension: '',
            address: '',
            sex: '',
            birthdate: '',
            contact: '',
            email: '',
            password: '',
            username: ''
          };
        })
        .catch(error => {
          console.error('Error adding patient:', error);
        });
    },
    fetchPatients() {
      axios.get('http://127.0.0.1:8000/api/user')
        .then(response => {
          this.patients = response.data.sort((a, b) => a.id - b.id);
        })
        .catch(error => {
          console.error('Error fetching patients:', error);
        });
    },
    editPatient(patient) {
      this.editedPatient = { ...patient };
      this.showEditModal = true;
    },
    fullName(patient) {
      let nameParts = [];
      if (patient.fname) nameParts.push(patient.fname);
      if (patient.mname) nameParts.push(patient.mname.charAt(0) + '.');
      if (patient.lname) nameParts.push(patient.lname);
      if (patient.extension) nameParts.push(patient.extension);
      return nameParts.join(' ');
    },
    submitEdit() {
      axios.put(`http://127.0.0.1:8000/api/user/${this.editedPatient.user_id}`, this.editedPatient)
        .then(response => {
          console.log('Patient updated successfully:', response.data);
          this.showEditModal = false;
          this.fetchPatients();
        })
        .catch(error => {
          console.error('Error updating patient:', error);
        });
    },
    resetFormFields() {
      this.newPatient = {
        fname: '',
        mname: '',
        lname: '',
        extension: '',
        address: '',
        sex: '',
        birthdate: '',
        contact: '',
        email: '',
        password: '',
        username: ''
      };
    }
  }
}
</script>


<style scoped>
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

.patient {
display: flex;
align-items: center;
flex: 1;
}

.patient .text {
margin-left: 1rem;
color: var(--dark);
font-size: 1.5rem;
font-weight: 900;
}

.patient i {
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
}

.modal-header {
  background-color: #339933; /* Green background */
  color: white; /* Text color for contrast */
  padding: 1px; /* Space inside the header */
  border-top-left-radius: 8px; /* Rounded corners */
  border-top-right-radius: 8px;
  font-size: 1.2rem;
  letter-spacing: 1.5px;
  font-weight: bold;
  text-align: center; /* Center the header text */
  margin: -20px;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.close {
position: absolute;
top: 10px;
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
cursor: pointer;
font-weight: bold;
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
border-radius: 5px;
font-weight: bold;
}

.add-button:hover {
background-color: #0f6c44;
}

.cancel-button:hover {
background-color: #b6b5b5;
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
font-weight: bold;
}

.edit-button:hover{
background-color: #0f6c44;
}
.patients-list-container {
padding: 20px;
}

.title-container {
display: flex;
padding: 20px
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

.form-columns {
  display: flex;
  gap: 15px;
}

.form-column {
  flex: 1;
  padding: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  text-align: left;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

input, select {
  width: 100%;
  max-width: 500px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-column {
flex: 1;
padding: 1.2rem;
padding-top: 2.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columns */
  grid-gap: 20px; /* Spacing between items */
  margin-top: 20px;
}

.form-group {
  margin-bottom: 10px;
}

.label {
font-weight: bold;
margin-bottom: 5px;
display: block;
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
}

.button-group {
display: flex;
justify-content: flex-end;
margin-top: 10px;
gap: 10px;
}

.cancel-button,
.submit-button {
padding: 10px 20px;
border: none;
border-radius: 5px;
cursor: pointer;
transition: background-color 0.3s;
}

.cancel-button {
background-color: #ccc;
color: #333;
font-weight: bold;
}

.submit-button {
background-color: #188754;
color: white;
}

.submit-button:hover {
background-color: #0f6c44;
}
table {
width: 100%;
border-collapse: collapse;
font-family: 'Product Sans', sans-serif;
}

th, td {
padding: 8px;
text-align: center;
border-bottom: 1px solid #ddd;
}

th {
background-color: #169d53;
color: white;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 5px;
  display: block;
}

.error-message-contact {
  color: red;
  font-size: .8rem;
  margin-top: 5px;
  display: block;
  position: absolute;
  margin-left:2.5rem;
}

.required {
  color: red;
  margin-left: 1px;
  position:absolute;
}
</style>