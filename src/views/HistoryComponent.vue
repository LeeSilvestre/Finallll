<template>
  <div class="top-container">
    <h1 class="bg-title">History</h1>
    <div class="queue">
      <span class="text">History</span>
      <i class="fas fa-tasks"></i>
      <hr />
    </div>
  </div>
<div class="patients-list-container">
  <div class="title-container">
    <div class="search-container">
      <i class="fas fa-search search-icon"></i>
      <input type="text" v-model="searchQuery" placeholder="Search Patients" class="search-bar">
    </div>
  </div>
  <div class="table-container">
        <div class="table-header">
        <div class="search-container">
        </div>
  </div>
  <table class="patients-table">
    <thead>
      <tr>
        <th>NO.</th>
        <th>NAME</th>
        <!-- <th>AGE</th> -->
        <th>ADDRESS</th>
        <!-- <th>GENDER</th>
        <th>CONTACT</th> -->
        <!-- <th>DOSAGE STATUS</th> -->
        <th>CATEGORY</th>
        <th>VACCINE RECORD</th>
        <!-- <th>ACTION</th> -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="(patient, index) in paginatedPatients2" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ fullName(patient) }}</td>
        <!-- <td>{{ calculateAge(patient.birthdate) }}</td> -->
        <td>{{ patient.address }}</td>
        <!-- <td>{{ patient.sex === 'male' ? 'M' : 'F' }}</td>
        <td>0{{ patient.contact }}</td> -->
        <!-- <td>{{ getStatusText(patient.status) }}</td> -->
        <td :style="{ color: getCategoryName(patient.expcateg).color }">
          {{ getCategoryName(patient.expcateg).name }}
        </td>
        <td><button class="edit-button" @click="viewRecord(patient)">VIEW</button></td>
        <!-- <td><button class="edit-button" @click="editPatient(patient)">UPDATE RECORD</button></td> -->
      </tr>
    </tbody>
  </table>

  <!-- Pagination -->
  <div class="pagination">
    <button @click="prevPage2" :disabled="currentPage2 === 1">
      <i class="fas fa-chevron-left"></i>
    </button>
    <span>Page {{ currentPage2 }} of {{ totalPages2 }}</span>
    <button @click="nextPage2" :disabled="currentPage2 === totalPages2">
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</div>
</div>
  <!-- <div class="patients-container">
    <div class="patient-box" v-for="(patient, index) in filteredPatients" :key="index">
      <div class="patient-info">
        <div class="image-container">
          <img class="patient-image" :src="getPatientImage(patient.user_photo)" alt="Profile Image">
          <div><strong>VACC ID:</strong> {{ patient.vacc_id }}</div>
        </div>
        <div class="text-info">
            <div><strong>NAME:</strong> {{ fullName(patient) }}</div>
            <div><strong>AGE:</strong> {{ calculateAge(patient.birthdate) }}</div>
            <div><strong>ADDRESS:</strong> {{ patient.address }}</div>
            <div><strong>GENDER:</strong> {{ patient.sex === 'male' ? 'M' : 'F' }}</div>
            <div><strong>CONTACT:</strong> 0{{ patient.contact }}</div>
            <div class="id-info">
              <div><strong>Date of Exposure:</strong> {{ formatDate(patient.expdate) }}</div>
              <div><strong>Address of Exposure:</strong> {{ patient.expplace }}</div>
              <div><strong>Type of Exposure:</strong> {{ patient.exptype }}</div>
              <div><strong>Source of Exposure:</strong> {{ patient.expsource }}</div>
              <div><strong>Category of Exposure:</strong> {{ patient.expcateg }}</div>
              <div><strong>Site of Exposure:</strong> {{ patient.expsite }}</div>
              <div><strong>Washing of Bite Wound:</strong> {{ patient.wash === 0 ? 'NO' : 'YES' }}</div>

              <div style="margin-top: 17px;"><strong>Remaining Schedules:</strong></div>
              <div v-if="patient.day3 === 0"><strong>Day 3:</strong> {{ formatDate(patient.date3) }}</div>
              <div v-if="patient.day7 === 0"><strong>Day 7:</strong> {{ formatDate(patient.date7) }}</div>
              <div v-if="patient.day28 === 0"><strong>Day 28:</strong> {{ formatDate(patient.date28) }}</div>
            </div>
        </div>
      </div>
      <div class="edit-button-container">
        <button class="edit-button" @click="editPatient(patient)">UPDATE RECORD</button>
      </div>
    </div>
  </div>
  </div> -->
  <!--EDIT MODAL-->
  <div class="modal" v-if="showEditModal">
    <div class="modal-content">
      <h2>{{editedPatient.fname}}'s Vaccine Record</h2>
      <div class="text-info">
            <div><strong>AGE:</strong> {{ calculateAge(editedPatient.birthdate) }}</div>
            <div><strong>ADDRESS:</strong> {{ editedPatient.address }}</div>
            <div><strong>GENDER:</strong> {{ editedPatient.sex === 'male' ? 'M' : 'F' }}</div>
            <div><strong>CONTACT:</strong> 0{{ editedPatient.contact }}</div>
            <div class="id-info">
              <div><strong>Date of Exposure:</strong> {{ formatDate(editedPatient.expdate) }}</div>
              <div><strong>Address of Exposure:</strong> {{ editedPatient.expplace }}</div>
              <div><strong>Type of Exposure:</strong> {{ editedPatient.exptype }}</div>
              <div><strong>Category of Exposure:</strong> {{ editedPatient.expcateg }}</div>
              <div><strong>Source of Exposure:</strong> {{ editedPatient.expsource }}</div>
              <div><strong>Site of Exposure:</strong> {{ editedPatient.expsite }}</div>
              <div style="margin-bottom: 15px;"><strong>Washing of Bite Wound:</strong> {{ editedPatient.wash === 0 ? 'NO' : 'YES' }}</div>
            </div>
        </div>
      <div class="form-columns">
        <!-- Left Column -->
        <div class="form-column">

            <div style="margin-top: 15px;"><strong>Day 0:</strong> {{ formatDate(editedPatient.date0) }} <i v-if="editedPatient.date0" class="fas fa-check"></i></div>
            <div><strong>Day 3:</strong> {{ formatDate(editedPatient.date3) }} <template v-if="editedPatient.day3 === 1"><i class="fas fa-check"></i></template><template v-else><input type="checkbox" v-model="editedPatient.day3"></template></div>
            <div v-if="editedPatient.day3 === 1">
              <strong>Day 7:</strong> {{ formatDate(editedPatient.date7) }}
              <template v-if="editedPatient.day7 === 1"><i class="fas fa-check"></i></template>
              <template v-else><input type="checkbox" v-model="editedPatient.day7"></template>
            </div>
            <div v-if="editedPatient.day7 === 1">
              <strong>Day 28:</strong> {{ formatDate(editedPatient.date28) }}
              <template v-if="editedPatient.day28 === 1"><i class="fas fa-check"></i></template>
              <template v-else><input type="checkbox" v-model="editedPatient.day28"></template>
            </div>
        </div>
      </div>

      <div class="button-group">
        <button type="submit" @click="submitEdit" class="submit-button" :disabled="!isUpdateEnabled" :class="{ 'disabled-button': !isUpdateEnabled }">Update</button>
        <button class="cancel-button" @click="showEditModal = false">Cancel</button>
      </div>
    </div>
  </div>
  <div class="modal" v-if="showViewModal">
    <div class="modal-content">
      <h2>{{viewPatient.fname}} {{ viewPatient.lname }}'s Vaccine Record</h2>
      <div class="text-info">
            <div><strong>AGE:</strong> {{ calculateAge(viewPatient.birthdate) }}</div>
            <div><strong>ADDRESS:</strong> {{ viewPatient.address }}</div>
            <div><strong>GENDER:</strong> {{ viewPatient.sex === 'male' ? 'M' : 'F' }}</div>
            <div><strong>CONTACT:</strong> 0{{ viewPatient.contact }}</div>
            <div class="id-info">
              <div><strong>Date of Exposure:</strong> {{ formatDate(viewPatient.expdate) }}</div>
              <div><strong>Address of Exposure:</strong> {{ viewPatient.expplace }}</div>
              <div><strong>Type of Exposure:</strong> {{ viewPatient.exptype }}</div>
              <div><strong>Source of Exposure:</strong> {{ viewPatient.expsource }}</div>
              <div><strong>Site of Exposure:</strong> {{ viewPatient.expsite }}</div>
              <div style="margin-bottom: 15px;"><strong>Washing of Bite Wound:</strong> {{ viewPatient.wash === 0 ? 'NO' : 'YES' }}</div>
              <div><strong>Category of Exposure:</strong> {{ viewPatient.expcateg }}</div>
            </div>
        </div>
      <div class="form-columns">
        <!-- Left Column -->
        <div class="form-column">
          <div v-if="viewPatient.booster === 1">
                <div style="margin-top: 17px;"><strong>Booster Schedule:</strong>{{ formatDate(viewPatient.boost_date) }}<i class="fas fa-check"></i></div>
                </div>
                <div v-else>
                <div style="margin-top: 17px;"><strong>Schedules:</strong></div>
                <div><strong>Day 0:</strong> {{ formatDate(viewPatient.date0) }}<i class="fas fa-check"></i></div>
                <div><strong>Day 3:</strong> {{ formatDate(viewPatient.date3) }}<template v-if="viewPatient.day3 === 1"><i class="fas fa-check"></i></template></div>
                <div><strong>Day 7:</strong> {{ formatDate(viewPatient.date7) }}<template v-if="viewPatient.day7 === 1"><i class="fas fa-check"></i></template></div>
                <div><strong>Day 28:</strong> {{ formatDate(viewPatient.date28) }}<template v-if="viewPatient.day28 === 1"><i class="fas fa-check"></i></template></div>
                </div>
      </div>
      </div>

      <div class="button-group">
        <button class="cancel-button" @click="showViewModal = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';
export default {
  name: 'NewPatients',
  data() {
    return {
      patients: [],
      showAddModal: false,
      showEditModal: false,
      showViewModal: false,
      newPatient: { 
        user_id: '',
        expdate: '',
        exptype: '',
        expplace: '',
        expsource: '',
        expsite: '',
        wash: '',
      },
      editedPatient: {
        vacc_id: '',
        user_id: '',
        expcateg: '',
        day0: '',
        expdate: '',
        expplace: '',
        expsource: '',
        expsite: '',
        wash: '',
        day3: 0,
        day7: 0,
        day28: 0,
        booster: '',
        boost_date: ''
      },
      viewPatient: {
        vacc_id: '',
        user_id: '',
        expcateg: '',
        day0: '',
        expdate: '',
        expplace: '',
        expsource: '',
        expsite: '',
        wash: '',
        day3: 0,
        day7: 0,
        day28: 0,
        booster: '',
        boost_date: ''
      },
      currentPage: 1,
      currentPage2: 1,
      rowsPerPage: 10,
      searchQuery: '',
      searchQuery2: '',
    };
  },
  mounted() {
    this.fetchPatients();
  },
  computed: {
    filteredPatients() {
      return this.patients.filter(patient => patient.status == 2 && this.matchesSearchQuery(patient))
      .sort((a, b) => {
        return new Date(a.is_queued) - new Date(b.is_queued);
      });
    },
    filteredPatients2() {
      return this.patients.filter(patient => patient.status == 4 && this.matchesSearchQuery(patient))
      .sort((a, b) => {
        return new Date(b.is_done) - new Date(a.is_done);
      });
    },
    paginatedPatients() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredPatients.slice(start, end);
    },
    paginatedPatients2() {
      const start = (this.currentPage2 - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredPatients2.slice(start, end);
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredPatients.length / this.rowsPerPage));
    },
    totalPages2() {
      return Math.max(1, Math.ceil(this.filteredPatients2.length / this.rowsPerPage));
    },
    isUpdateEnabled() {
      let isActive = false;
      if (this.editedPatient.day3 === true) {
        isActive = true;
        console.log('Day 3 is active');
      } else if (this.editedPatient.day7 === true) {
        isActive = true;
        console.log('Day 7 is active');
      } else if (this.editedPatient.day28 === true) {
        isActive = true;
        console.log('Day 28 is active');
      } else {
        console.log('No active day');
      }
      console.log('Active checkbox status:', isActive);
      return isActive;
      },
  },
  methods: {
    matchesSearchQuery(patient) {
      const query = this.searchQuery.toLowerCase();
      return (
        this.fullName(patient).toLowerCase().includes(query) ||
        patient.address.toLowerCase().includes(query) ||
        patient.contact.toString().includes(query)
      );
    },
    viewRecord(patient) {
      this.showViewModal = true;
      this.viewPatient = { ...patient };
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages2) {
        this.currentPage++;
      }
    },
    prevPage2() {
      if (this.currentPage2 > 1) {
        this.currentPage2--;
      }
    },
    nextPage2() {
      if (this.currentPage2 < this.totalPages2) {
        this.currentPage2++;
      }
    },
    getStatusText(booster) {
      if (booster == 0) {
        return { name: 'No Dosage', color: 'green' };
      }
      if (booster == 1) {
        return { name: 'Booster', color: 'orange' }; // or 'yellow'
      }
      return ""; // Default case
    },
    getCategoryName(expcateg) {
      if (expcateg == 1) {
        return { name: 'Cat I', color: 'green' };
      }
      if (expcateg == 2) {
        return { name: 'Cat II', color: 'orange' }; // or 'yellow'
      }
      if (expcateg == 3) {
        return { name: 'Cat III', color: 'red' };
      }
      return { name: 'Unknown', color: 'gray' }; // Default case
    },
    getPatientImage(userPhoto) {
      try {
        return require(`../assets/${userPhoto}`);
      } catch (e) {
        return require('../assets/profile.jpg');
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    },
    getCurrentDate() {
      const now = new Date();
      const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
      const month = monthNames[now.getMonth()];
      const day = now.getDate();
      const year = now.getFullYear();
      return `${month} ${day}, ${year}`;
    },
    getFutureDate(days) {
      const now = new Date();
      const futureDate = new Date(now.setDate(now.getDate() + days));
      const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
      const month = monthNames[futureDate.getMonth()];
      const day = futureDate.getDate();
      const year = futureDate.getFullYear();
      return `${month} ${day}, ${year}`;
    },
    calculateAge(birthdate) {
      const today = new Date();
      const birthDate = new Date(birthdate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    submitForm() {
      axios.post('http://127.0.0.1:8000/api/record', this.newPatient)
        .then(response => {
          console.log('Record added successfully:', response.data);
          this.showAddModal = false; // Close modal after successful submission
          this.fetchPatients(); // Fetch updated patient list
          // Reset form fields if needed
          this.newPatient = {
            user_id: '',
            expdate: '',
            exptype: '',
            expsource: '',
            expplace: '',
            expsite: '',
            wash: '',
          };
        })
        .catch(error => {
          console.error('Error adding record:', error);
        });
    },
    fetchPatients() {
      axios.get('http://127.0.0.1:8000/api/record')
        .then((response) => {
          const recordData = response.data;

          const userIds = recordData.map(patient => patient.user_id);
          axios.get('http://127.0.0.1:8000/api/user', { params: { ids: userIds }})
            .then((userResponse) => {
              const userData = userResponse.data;

              const patients = recordData.map(record => {
                const user = userData.find(user => user.user_id === record.user_id);
                return {
                  ...record,
                  fname: user.fname,
                  mname: user.mname,
                  lname: user.lname,
                  extension: user.extension,
                  birthdate: user.birthdate,
                  address: user.address,
                  contact: user.contact,
                  sex: user.sex,
                  user_photo: user.user_photo,
                };
              });

              this.patients = patients;
            })
            .catch(error => {
              console.error('Error fetching user data:', error);
            });
        })
        .catch(error => {
          console.error('Error fetching record data:', error);
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
      // Show confirmation dialog
      Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, update it!',
          cancelButtonText: 'No, cancel!',
      }).then((result) => {
          if (result.isConfirmed) {
              // Proceed with the update if confirmed
              const updatedData = {
                  expcateg: this.editedPatient.expcateg,
                  day3: this.editedPatient.day3 ? 1 : 0,
                  day7: this.editedPatient.day7 ? 1 : 0,
                  day28: this.editedPatient.day28 ? 1 : 0,
                  status: 3
              };
              
              axios.put(`http://127.0.0.1:8000/api/record/${this.editedPatient.vacc_id}`, updatedData)
                  .then(response => {
                      console.log('Record updated successfully:', response.data);
                      this.showEditModal = false;
                      this.fetchPatients();
                      Swal.fire(
                          'Updated!',
                          'The record has been updated.',
                          'success'
                      );
                  })
                  .catch(error => {
                      console.error('Error updating record:', error);
                      Swal.fire(
                          'Error!',
                          'There was an error updating the record.',
                          'error'
                      );
                  });
          }
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
        password: ''
      };
    }
  }
}
</script>


<style scoped>
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
.yelloworange {
  background-color: #FFB600; /* Yellow-orange */
}
.green {
  background-color: #00FF00; /* Green */
}
.red {
  background-color: #FF0000; /* Red */
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

.queue {
display: flex;
align-items: center;
flex: 1;
}

.queue .text {
margin-left: 1rem;
color: var(--dark);
font-size: 1.5rem;
font-weight: 900;
}

.queue i {
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

.disabled-button {
  background-color: #b0b0b0; /* Dimmed background */
  cursor: not-allowed; /* Change cursor to indicate that the button is disabled */
  opacity: 0.5; /* Reduce opacity to make it look disabled */
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

.table-container {
overflow-x: auto;
text-align: center;
font-family: 'Product Sans', sans-serif;
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

th, td {
padding: 8px;
text-align: center;
border-bottom: 1px solid #ddd;
}

th {
background-color: #169d53;
color: white;
}
</style>