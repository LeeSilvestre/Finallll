<template>
  <div class="top-container">
    <h1 class="bg-title">Scheduled Today</h1>
    <div class="old">
      <span class="text">ScheduledToday</span>
      <i class="fas fa-user"></i>
      <hr />
    </div>
  </div>
<div class="patients-list-container">
  </div>
  <div class="patients-tables-container">
    <!-- First Table -->
      <div class="table-container">
        <h3>NO DOSAGE / BOOSTER</h3>
        <div class="table-header">
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search Patients"
            class="search-bar"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
    <button @click="exportToExcel" class="export-button">Export to Excel</button>
    <button class="export-button" @click="showAddModal = true">Create</button>
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
        <th>DOSAGE STATUS</th>
        <!-- <th>CATEGORY</th> -->
        <!-- <th>VACCINE RECORD</th> -->
        <th>ACTION</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(patient, index) in paginatedPatients" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ fullName(patient) }}</td>
        <!-- <td>{{ calculateAge(patient.birthdate) }}</td> -->
        <td>{{ patient.address }}</td>
        <!-- <td>{{ patient.sex === 'male' ? 'M' : 'F' }}</td>
        <td>0{{ patient.contact }}</td> -->
        <!-- <td>{{ getStatusText(patient.booster) }}</td> -->
        <td :style="{ color: getStatusText(patient.booster).color }">
          {{ getStatusText(patient.booster).name }}
        </td>
        <!-- <td :style="{ color: getCategoryName(patient.expcateg).color }">
          {{ getCategoryName(patient.expcateg).name }}
        </td> -->
        <!-- <td><button class="edit-button" @click="viewRecord(patient)">VIEW</button></td> -->
        <td><button 
          class="edit-button" 
          @click="patient.booster === 1 ? provideBoosterRecord(patient) : editPatient(patient)"
        >
          {{ patient.booster === 1 ? 'Provide Booster' : 'Provide Vaccination' }}
        </button></td>
      </tr>
    </tbody>
  </table>

  <!-- Pagination -->
  <div class="pagination">
    <button @click="prevPage" :disabled="currentPage === 1">
      <i class="fas fa-chevron-left"></i>
    </button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage === totalPages">
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</div>
<!-- Second Table -->
<div class="table-container">
        <h3>FOLLOW-UP DOSAGES</h3>
        <div class="table-header">
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery2"
            placeholder="Search Patients"
            class="search-bar"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
    <button @click="exportToExcel2" class="export-button">Export to Excel</button>
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
        <th>ACTION</th>
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
        <td><button class="edit-button" @click="updateStatus(patient)">QUEUE</button></td>
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
  <!--EDIT MODAL-->
  <div class="modal" v-if="showEditModal">
    <div class="modal-content">
      <h2>{{editedPatient.fname}} {{editedPatient.lname}}'s Vaccine Record</h2>
      <div class="text-info">
            <div><strong>AGE:</strong> {{ calculateAge(editedPatient.birthdate) }}</div>
            <div><strong>ADDRESS:</strong> {{ editedPatient.address }}</div>
            <div><strong>GENDER:</strong> {{ editedPatient.sex === 'male' ? 'M' : 'F' }}</div>
            <div><strong>CONTACT:</strong> 0{{ editedPatient.contact }}</div>
            <div class="id-info">
              <div><strong>Date of Exposure:</strong> {{ formatDate(editedPatient.expdate) }}</div>
              <div><strong>Address of Exposure:</strong> {{ editedPatient.expplace }}</div>
              <div><strong>Type of Exposure:</strong> {{ editedPatient.exptype }}</div>
              <div><strong>Source of Exposure:</strong> {{ editedPatient.expsource }}</div>
              <div><strong>Site of Exposure:</strong> {{ editedPatient.expsite }}</div>
              <div style="margin-bottom: 15px;"><strong>Washing of Bite Wound:</strong> {{ editedPatient.wash === 0 ? 'NO' : 'YES' }}</div>
            </div>
        </div>
      <div class="form-columns">
        <!-- Left Column -->
        <div class="form-column">

          <div class="form-group">
            <label for="edited-expcateg"><strong>Category of Exposure:</strong></label>
            <select id="edited-expcateg" v-model="editedPatient.expcateg" required>
              <option value="1">Category I Exposure (no risk)</option>
              <option value="2">Category II Exposure (minor)</option>
              <option value="3">Category III Exposure (severe)</option>
            </select>
          </div>

          <div v-if="editedPatient.booster === 1">
          <div style="margin-top: 15px;"><strong>Booster Date:</strong> {{ this.getCurrentDate() }}</div>
          </div>
          <div v-else>
          <div style="margin-top: 15px;"><strong>Day 0:</strong> {{ this.getCurrentDate() }}</div>
          <div><strong>Day 3:</strong> {{ this.getFutureDate(3) }}</div>
          <div><strong>Day 7:</strong> {{ this.getFutureDate(7) }}</div>
          <div><strong>Day 28:</strong> {{ this.getFutureDate(28) }}</div>
        </div>
        </div>
      </div>

      <div class="button-group">
        <button type="submit" @click="submitEdit" class="submit-button">Provide Record</button>
        <button class="cancel-button" @click="showEditModal = false">Cancel</button>
      </div>
    </div>
  </div>
  <!--ADD MODAL-->
  <div class="modal" v-if="showAddModal">
  <div class="modal-content">
    <h2>Add New Record</h2>
    <div class="form-columns">
      <!-- Left Column -->
      <div class="form-column">
        <div class="form-group">
          <label for="user_id">Patient</label>
          <select id="user_id" v-model="newPatient.user_id" required>
            <option v-for="user in availableUsers" :key="user.user_id" :value="user.user_id">{{ userFullName(user) }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="lname">Date of Exposure</label>
          <input type="date" id="lname" v-model="newPatient.expdate" :max="getCurrentDate()" required>
        </div>

        <div class="form-group">
          <label for="sex">Address of Exposure</label>
          <select id="source" v-model="newPatient.expplace" required>
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
          <label for="sex">Source of Exposure</label>
          <select id="source" v-model="newPatient.expsource" required>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>

      <!-- Right Column -->
      <div class="form-column">
        <div class="form-group">
          <label for="address">Type of Exposure</label>
          <select id="address" v-model="newPatient.exptype" required>
            <option value="Bite">Bite</option>
            <option value="Non-Bite">Non-Bite</option>
          </select>
        </div>

        <div class="form-group">
          <label for="email">Site of Exposure</label>
          <select id="email" v-model="newPatient.expsite" required>
            <option value="L. Hand">L. Hand</option>
            <option value="R. Hand">R. Hand</option>
            <option value="L. Arm">L. Arm</option>
            <option value="R. Arm">R. Arm</option>
            <option value="L. Leg">L. Leg</option>
            <option value="R. Leg">R. Leg</option>
            <option value="L. Foot">L. Foot</option>
            <option value="R. Foot">R. Foot</option>
            <option value="Head Part">Head Part</option>
          </select>
        </div>
        <div class="form-group">
          <label for="mname">Was Wound Washed?</label>
          <select id="mname" v-model="newPatient.wash" required>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>
    </div>

    <div class="button-group">
      <button type="submit" @click=submitForm class="submit-button">Submit</button>
      <button class="cancel-button" @click="showAddModal = false">Cancel</button>
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
          <div style="margin-top: 17px;"><strong>Schedules:</strong></div>
              <div><strong>Day 0:</strong> {{ formatDate(viewPatient.date0) }}<i class="fas fa-check"></i></div>
              <div><strong>Day 3:</strong> {{ formatDate(viewPatient.date3) }}<template v-if="viewPatient.day3 === 1"><i class="fas fa-check"></i></template></div>
              <div><strong>Day 7:</strong> {{ formatDate(viewPatient.date7) }}<template v-if="viewPatient.day7 === 1"><i class="fas fa-check"></i></template></div>
              <div><strong>Day 28:</strong> {{ formatDate(viewPatient.date28) }}<template v-if="viewPatient.day28 === 1"><i class="fas fa-check"></i></template></div>
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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export default {
  name: 'NewPatients',
  data() {
    return {
      availableUsers: [],
      patients: [],
      showAddModal: false,
      showEditModal: false,
      showViewModal: false,
      selectedDate: "",
      currentPage: 1,
      currentPage2: 1,
      rowsPerPage: 10,
      searchQuery: '',
      searchQuery2: '',
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
        wash: ''
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
        wash: ''
      }
    };
  },
  mounted() {
    this.fetchPatients();
    this.selectedDate = this.minDate;
    this.fetchAvailableUsers();
  },
  computed: {
    minDate() {
      const today = new Date();
      today.setDate(today.getDate() + 1); // Tomorrow
      return today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    },
    filteredPatients() {
      return this.patients.filter(patient => patient.status == 0 && this.matchesSearchQuery(patient));
    },
    filteredPatients2() {
      const options = { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Manila" };
      const philippineDate = new Date().toLocaleDateString("en-CA", options);

      console.log("Current Date (Philippines):", philippineDate);

      return this.patients.filter(patient => {
 
        return (
          (patient.status == 5 || patient.status == 3 || patient.status == 1) &&
          this.matchesSearchQuery2(patient) &&
          (
            (patient.day3 == 0 && patient.date3 == philippineDate) ||
            (patient.day7 == 0 && patient.date7 == philippineDate) ||
            (patient.day28 == 0 && patient.date28 == philippineDate)
          )
        );
      })
      .sort((a, b) => {
        if (a.expcateg == 3 && b.expcateg != 3) {
          return -1; 
        }
        if (a.expcateg != 3 && b.expcateg == 3) {
          return 1; 
        }
        const dateA = new Date(a.expdate);
        const dateB = new Date(b.expdate);
        return dateA - dateB; 
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

  },
  methods: {
    provideBoosterRecord(patient) {
      Swal.fire({
        title: 'Provide Booster Record',
        text: `Are you sure you want to provide a booster record for ${patient.fname}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ffae42',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, provide record!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showEditModal = true;
          this.editedPatient = { ...patient };
        }
      });
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
    exportToExcel() {
      // Ensure you are exporting only the filtered patients
      const patientData = this.filteredPatients.map(patient => ({
        "Full Name": this.fullName(patient),
        "Age": this.calculateAge(patient.birthdate),
        "Address": patient.address,
        "Gender": patient.sex === 'male' ? 'M' : 'F',
        "Contact": `0${patient.contact}`,
        "Date of Exposure": this.formatDate(patient.expdate),
        "Address of Exposure": patient.expplace,
        "Type of Exposure": patient.exptype,
        "Source of Exposure": patient.expsource,
        "Category of Exposure": patient.expcateg,
        "Site of Exposure": patient.expsite,
        "Washing of Bite Wound": patient.wash === 0 ? 'NO' : 'YES',
        "Remaining Schedules": [
          patient.day3 === 0 ? `Day 3: ${this.formatDate(patient.date3)}` : "",
          patient.day7 === 0 ? `Day 7: ${this.formatDate(patient.date7)}` : "",
          patient.day28 === 0 ? `Day 28: ${this.formatDate(patient.date28)}` : ""
        ].filter(Boolean).join(", "),
      }));

      if (patientData.length === 0) {
        Swal.fire('No data to export', 'The filtered list is empty!', 'info');
        return;
      }

      // Create a new worksheet
      const worksheet = XLSX.utils.json_to_sheet(patientData, {
        origin: 'A2', // Start data from row 2 to leave space for the title
      });

      // Add title to the sheet
      XLSX.utils.sheet_add_aoa(worksheet, [["Follow-up Dosage Report"]], { origin: 'A1' });

      // Style the title row
      worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(patientData[0]).length - 1 } }];

      // Adjust column width automatically
      worksheet['!cols'] = Object.keys(patientData[0]).map(() => ({ wch: 20 }));

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");

      // Write the file and trigger the download
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      saveAs(data, "Follow-up_Dosages_Report.xlsx");
    },
    exportToExcel2() {
      // Ensure you are exporting only the filtered patients
      const patientData = this.filteredPatients2.map(patient => ({
        "Full Name": this.fullName(patient),
        "Age": this.calculateAge(patient.birthdate),
        "Address": patient.address,
        "Gender": patient.sex === 'male' ? 'M' : 'F',
        "Contact": `0${patient.contact}`,
        "Date of Exposure": this.formatDate(patient.expdate),
        "Address of Exposure": patient.expplace,
        "Type of Exposure": patient.exptype,
        "Source of Exposure": patient.expsource,
        "Category of Exposure": patient.expcateg,
        "Site of Exposure": patient.expsite,
        "Washing of Bite Wound": patient.wash === 0 ? 'NO' : 'YES',
        "Remaining Schedules": [
          patient.day3 === 0 ? `Day 3: ${this.formatDate(patient.date3)}` : "",
          patient.day7 === 0 ? `Day 7: ${this.formatDate(patient.date7)}` : "",
          patient.day28 === 0 ? `Day 28: ${this.formatDate(patient.date28)}` : ""
        ].filter(Boolean).join(", "),
      }));

      if (patientData.length === 0) {
        Swal.fire('No data to export', 'The filtered list is empty!', 'info');
        return;
      }

      // Create a new worksheet
      const worksheet = XLSX.utils.json_to_sheet(patientData, {
        origin: 'A2', // Start data from row 2 to leave space for the title
      });

      // Add title to the sheet
      XLSX.utils.sheet_add_aoa(worksheet, [["Follow-up Dosage Report"]], { origin: 'A1' });

      // Style the title row
      worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(patientData[0]).length - 1 } }];

      // Adjust column width automatically
      worksheet['!cols'] = Object.keys(patientData[0]).map(() => ({ wch: 20 }));

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");

      // Write the file and trigger the download
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      saveAs(data, "Follow-up_Dosages_Report.xlsx");
    },
    fetchAvailableUsers() {
      axios.get('http://127.0.0.1:8000/api/user')
        .then(response => {
          // Store the fetched users in availableUsers
          this.availableUsers = response.data;
        })
        .catch(error => {
          console.error('Error fetching available users:', error);
        });
    },
    userFullName(user) {
      return `${user.fname} ${user.lname}`;
    },
    matchesSearchQuery(patient) {
      const query = this.searchQuery.toLowerCase();
      return (
        this.fullName(patient).toLowerCase().includes(query) ||
        patient.address.toLowerCase().includes(query) ||
        patient.contact.toString().includes(query)
      );
    },
    matchesSearchQuery2(patient) {
      const query = this.searchQuery2.toLowerCase();
      return (
        this.fullName(patient).toLowerCase().includes(query) ||
        patient.address.toLowerCase().includes(query) ||
        patient.contact.toString().includes(query)
      );
    },
    getPatientImage(userPhoto) {
      try {
        return require(`../assets/${userPhoto}`);
      } catch (e) {
        return require('../assets/profile.jpg');
      }
    },
    updateStatus(patient) {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to queue the patient?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed queuing!'
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with the update if the user confirms
          axios.put(`http://127.0.0.1:8000/api/queue/${patient.vacc_id}`)
            .then(() => {
              Swal.fire({
                title: 'Success',
                text: 'Patient queued successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
              });
              this.fetchPatients(); // Fetch updated patient list
            })
            .catch(error => {
              Swal.fire({
                title: 'Error',
                text: 'Failed to queue patient.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
              console.error('Error updating status:', error);
            });
        }
      });
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
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to submit this record?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit it!'
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with the form submission if the user confirms
          axios.post('http://127.0.0.1:8000/api/record', this.newPatient)
            .then(() => {
              Swal.fire({
                title: 'Success',
                text: 'Record added successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
              });
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
              Swal.fire({
                title: 'Error',
                text: 'Failed to add record.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
              console.error('Error adding record:', error);
            });
        }
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
      Swal.fire({
        title: 'Provide Vaccination Record',
        text: `Are you sure you want to provide a vaccination record for ${patient.fname}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, provide record!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showEditModal = true; // Show the edit modal after confirmation
          this.editedPatient = { ...patient };
        }
      });
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
      Swal.fire({
        title: 'Confirm Update',
        text: 'Are you sure you want to update this record?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          const payload = {
            expcateg: this.editedPatient.expcateg,
          };
          axios.put(`http://127.0.0.1:8000/api/record/${this.editedPatient.vacc_id}`, payload)
            .then(response => {
              console.log('expcateg updated successfully:', response.data);
              axios.put(`http://127.0.0.1:8000/api/inventory/use/1`)
                .then(stockResponse => {
                  console.log('Stock decreased successfully:', stockResponse.data);
                })
                .catch(error => {
                  console.error('Error decreasing stock:', error);
                });
              if (this.editedPatient.booster == 1) {
                axios.put(`http://127.0.0.1:8000/api/boost/${this.editedPatient.vacc_id}`)
                  .then(statusResponse => {
                    console.log('Status updated to 4:', statusResponse.data);
                    this.showEditModal = false;
                    this.fetchPatients(); 
                  })
                  .catch(error => {
                    console.error('Error updating status:', error);
                  });
              } else {
                this.showEditModal = false;
                this.fetchPatients();
              }
            })
            .catch(error => {
              console.error('Error updating expcateg:', error);
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
.date-filter {
  margin: 0 auto; /* Centers the date input */
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
background-color: #188754;
color: white;
border: none;
padding: 10px 20px;
cursor: pointer;
font-family: 'Product Sans', sans-serif;
border-radius: 5px;
}
.search-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%; /* Adjust width as needed */
  max-width: 400px; /* Optional: Limit the width of the search bar */
  margin-left: -120px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.search-bar {
  width: 100%;
  padding: 10px 40px 10px 15px; /* Adjust padding for icon space */
  border: 1px solid #ccc;
  border-radius: 20px; /* Rounded edges for modern look */
  outline: none;
  font-size: 16px;
  transition: border-color 0.3s ease;
  margin-left: 125px;
}

.search-bar:focus {
  border-color: #169d53; /* Highlight color on focus */
}

.search-icon {
  position: absolute;
  right: 15px; /* Align icon inside the search bar */
  color: #aaa; /* Icon color */
  font-size: 18px; /* Icon size */
  cursor: pointer;
}

.search-bar:hover + .search-icon,
.search-bar:focus + .search-icon {
  color: #169d53; /* Icon color on hover or focus */
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

.patients-tables-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-left: 2%;
  margin-right: 0.5%;
}

.table-container {
  flex: 1;
  overflow-x: auto;
  width: 100%;
}
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
table {
  width: 100%;
  border-collapse: collapse;
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