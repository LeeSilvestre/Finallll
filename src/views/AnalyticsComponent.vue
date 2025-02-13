<template>
  <div class="top-container">
    <h1 class="bg-title">Vaccination Accomplishment Report</h1>
    <div class="patient">
      <span class="text">VaccinationAccomplishment</span>
      <i class="fas fa-table"></i>
      <hr />
    </div>
    <button @click="exportToPDF" class="export-button">Generate Report</button>
  </div>

  <!-- <div class="year-filter">
    <label for="year">Select Year: </label>
    <select v-model="selectedYear" @change="filterByYear">
      <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
    </select>
  </div> -->

  <div>
    <table ref="table" class="styled-table">
      <thead>
        <tr>
          <th>Province/City<br />Municipalities</th>
          <th colspan="2">Sex</th>
          <th colspan="2">Age</th>
          <th colspan="3">AB Category <br></th>
          <!-- <th colspan="1">HR</th>
          <th colspan="4">Post Exposure Prophylaxis</th> -->
          <th>Booster Dose</th>
          <!-- <th>PreP</th> -->
          <th colspan="3">Biting Animal</th>
          <th colspan="2">Wash</th>
          <th>Total<br /></th>
        </tr>
        <tr>
          <th>Barangay</th>
          <th>Male</th>
          <th>Female</th>
          <th>&lt;15</th>
          <th>&gt;15</th>
          <th>Cat I</th>
          <th>Cat II</th>
          <th>Cat III</th>
          <!-- <th>No.</th>
          <th>TCV</th>
          <th># c. TCV</th>
          <th>HRIG</th>
          <th>ERIG</th> -->
          <th>No.</th>
          <!-- <th>No.</th> -->
          <th>Dog</th>
          <th>Cat</th>
          <th>Others</th>
          <th>Yes</th>
          <th>No</th>
          <th>No.</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableData" :key="row.expplace" class="table-row">
          <td>{{ row.expplace }}</td>
          <td @click="fetchGender(row.expplace, 'male')">{{ row.male_count }}</td>
          <td @click="fetchGender(row.expplace, 'female')">{{ row.female_count }}</td>
          <td @click="fetchAge(row.expplace, 'under_15')">{{ row.age_under_15_count }}</td>
          <td @click="fetchAge(row.expplace, '15_and_above')">{{ row.age_15_and_above_count }}</td>
          <td @click="fetchRecords(row.expplace, 1)">{{ row.expcateg_1_count }}</td>
          <td @click="fetchRecords(row.expplace, 2)">{{ row.expcateg_2_count }}</td>
          <td @click="fetchRecords(row.expplace, 3)">{{ row.expcateg_3_count }}</td>
          <!-- <td>0</td>
          <td>{{ row.total_records }}</td>
          <td>{{ row.total_records }}</td> -->
          <!-- <td>0</td> -->
          <!-- <td>0</td> -->
          <td @click="fetchBoosters(row.expplace, 1)">{{ row.booster_count }}</td>
          <!-- <td>0</td> -->
          <td @click="fetchAnimals(row.expplace, 'Dog')">{{ row.expsource_dog_count }}</td>
          <td @click="fetchAnimals(row.expplace, 'Cat')">{{ row.expsource_cat_count }}</td>
          <td @click="fetchAnimals(row.expplace, 'Others')">{{ row.expsource_others_count }}</td>
          <td @click="fetchWash(row.expplace, 1)">{{ row.wash_1_count }}</td>
          <td @click="fetchWash(row.expplace, 0)">{{ row.wash_0_count }}</td>
          <td class="yellow-column">{{ row.total_records }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="total-row">
          <td colspan="1">TOTAL</td>
          <td>{{ total.male }}</td>
          <td>{{ total.female }}</td>
          <td>{{ total.age_under_15 }}</td>
          <td>{{ total.age_15_and_above }}</td>
          <td>{{ total.expcateg_1 }}</td>
          <td>{{ total.expcateg_2 }}</td>
          <td>{{ total.expcateg_3 }}</td>
          <!-- <td>0</td>
          <td>{{ total.total_records }}</td>
          <td>{{ total.total_records }}</td> -->
          <!-- <td>0</td> -->
          <!-- <td>0</td> -->
          <td>{{ total.booster }}</td>
          <!-- <td>0</td> -->
          <td>{{ total.expsource_dog }}</td>
          <td>{{ total.expsource_cat }}</td>
          <td>{{ total.expsource_others }}</td>
          <td>{{ total.wash_1 }}</td>
          <td>{{ total.wash_0 }}</td>
          <td>{{ total.total_records }}</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div v-if="showGenderModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Records for {{ selectedExpPlace }} - Sex: {{ selectedGender }}</h2>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in fetchedGender" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ record.fname }}</td>
            <td>{{ record.lname }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="showGenderModal = false">Close</button>
    </div>
  </div>

  <div v-if="showAgeModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Records for {{ selectedExpPlace }}</h2>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in fetchedAge" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ record.fname }}</td>
            <td>{{ record.lname }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="showAgeModal = false">Close</button>
    </div>
  </div>

  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Records for {{ selectedExpPlace }} - Category {{ selectedExpCateg }}</h2>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in fetchedRecords" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ record.fname }}</td>
            <td>{{ record.lname }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="showModal = false">Close</button>
    </div>
  </div>

  <div v-if="showBoostModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Records for {{ selectedExpPlace }} - Boosters</h2>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in fetchedBoosters" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ record.fname }}</td>
            <td>{{ record.lname }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="showBoostModal = false">Close</button>
    </div>
  </div>

  <div v-if="showAnimalModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Records for {{ selectedExpPlace }} - Biting Animal: {{ selectedAnimal }}</h2>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in fetchedAnimals" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ record.fname }}</td>
            <td>{{ record.lname }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="showAnimalModal = false">Close</button>
    </div>
  </div>

  <div v-if="showWashModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Records for {{ selectedExpPlace }}</h2>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in fetchedWash" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ record.fname }}</td>
            <td>{{ record.lname }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="showWashModal = false">Close</button>
    </div>
  </div>

  <div class="charts-container">
    <!-- First row of charts -->
    <div class="chart-row">
      <div class="chart">
        <h3>Sex Distribution</h3>
        <canvas id="sexDistributionChart"></canvas>
      </div>
      <div class="chart">
        <h3>Age Group</h3>
        <canvas id="ageGroupChart"></canvas>
      </div>
      <div class="chart">
        <h3>Exposure Category</h3>
        <canvas id="exposureCategoryChart"></canvas>
      </div>
    </div>

  </div>
</template>

<script>
import { nextTick } from 'vue';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Chart from 'chart.js/auto';
import axios from 'axios';

export default {
  data() {
    return {
      tableData: [],
      total: {
        male: 0,
        female: 0,
        age_under_15: 0,
        age_15_and_above: 0,
        expcateg_1: 0,
        expcateg_2: 0,
        expcateg_3: 0,
        booster: 0,
        expsource_dog: 0,
        expsource_cat: 0,
        expsource_others: 0,
        wash_0: 0,
        wash_1: 0,
        total_records: 0
      },
      selectedYear: '', 
      availableYears: [],
      showModal: false,
      showBoostModal: false,
      showAnimalModal: false,
      showWashModal: false,
      showGenderModal: false,
      showAgeModal: false,
      currentPage: 1,
      itemsPerPage: 5,
      searchQuery: "",
      selectedExpPlace: '',
      selectedExpCateg: '',
      selectedBooster: '',
      selectedAnimal: '',
      selectedWash: '',
      selectedGender: '',
      selectedAge: '',
      fetchedRecords: [],
      fetchedBoosters: [],
      fetchedAnimals: [],
      fetchedWash: [],
      fetchedGender: [],
      fetchedAge: [],
    };
  },
  computed: {
    totalPages() {
    return Math.ceil(this.selectedRow.people.length / this.itemsPerPage);
    },
    paginatedPeople() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.selectedRow.people.slice(start, end);
    }
  },
  mounted() {
    this.fetchVaccinationReport();
  },
  methods: {
    async fetchRecords(expplace, expcateg) {
      this.selectedExpPlace = expplace;
      this.selectedExpCateg = expcateg;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/vaccination-report/filtered?expplace=${expplace}&expcateg=${expcateg}`);
        this.fetchedRecords = await Promise.all(response.data.map(async (record) => {
          const userResponse = await axios.get(`http://127.0.0.1:8000/api/user/${record.user_id}`);
          return {
            ...record,
            lname: userResponse.data.lname,
            fname: userResponse.data.fname,
            mname: userResponse.data.mname,
          };
        }));
        this.showModal = true;
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    },
    async fetchBoosters(expplace, booster) {
      this.selectedExpPlace = expplace;
      this.selectedBooster = booster;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/vaccination-report/filtered?expplace=${expplace}&booster=${booster}`);
        this.fetchedBoosters = await Promise.all(response.data.map(async (record) => {
          const userResponse = await axios.get(`http://127.0.0.1:8000/api/user/${record.user_id}`);
          return {
            ...record,
            lname: userResponse.data.lname,
            fname: userResponse.data.fname,
            mname: userResponse.data.mname,
          };
        }));
        this.showBoostModal = true;
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    },
    async fetchAnimals(expplace, expsource) {
      this.selectedExpPlace = expplace;
      this.selectedAnimal = expsource;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/vaccination-report/filtered?expplace=${expplace}&expsource=${expsource}`);
        this.fetchedAnimals = await Promise.all(response.data.map(async (record) => {
          const userResponse = await axios.get(`http://127.0.0.1:8000/api/user/${record.user_id}`);
          return {
            ...record,
            lname: userResponse.data.lname,
            fname: userResponse.data.fname,
            mname: userResponse.data.mname,
          };
        }));
        this.showAnimalModal = true;
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    },
    async fetchWash(expplace, wash) {
      this.selectedExpPlace = expplace;
      this.selectedWash = wash;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/vaccination-report/filtered?expplace=${expplace}&wash=${wash}`);
        this.fetchedWash = await Promise.all(response.data.map(async (record) => {
          const userResponse = await axios.get(`http://127.0.0.1:8000/api/user/${record.user_id}`);
          return {
            ...record,
            lname: userResponse.data.lname,
            fname: userResponse.data.fname,
            mname: userResponse.data.mname,
          };
        }));
        this.showWashModal = true;
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    },
    async fetchGender(expplace, sex) {
      this.selectedExpPlace = expplace;
      this.selectedGender = sex;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/vaccination-report/filtered?expplace=${expplace}&sex=${sex}`);
        const records = Object.values(response.data);
        this.fetchedGender = await Promise.all(records.map(async (record) => {
        const userResponse = await axios.get(`http://127.0.0.1:8000/api/user/${record.user_id}`);
        return {
          ...record,
          lname: userResponse.data.lname,
          fname: userResponse.data.fname,
          mname: userResponse.data.mname,
        };
      }));
        this.showGenderModal = true;
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    },
    async fetchAge(expplace, age_group) {
      this.selectedExpPlace = expplace;
      this.selectedAge = age_group;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/vaccination-report/filtered?expplace=${expplace}&age_group=${age_group}`);
        const records = Object.values(response.data);
        this.fetchedAge = await Promise.all(records.map(async (record) => {
        const userResponse = await axios.get(`http://127.0.0.1:8000/api/user/${record.user_id}`);
        return {
          ...record,
          lname: userResponse.data.lname,
          fname: userResponse.data.fname,
          mname: userResponse.data.mname,
        };
      }));
        this.showAgeModal = true;
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
      nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    showDetails(row) {
      this.selectedRow = row;
      this.showModal = true;
    },
    async fetchVaccinationReport() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/vaccination-report');
        this.tableData = response.data; 
        this.extractYears();
        this.setDefaultYear();
        this.filterByYear();
        this.computeTotals(); 
        this.createSexDistributionChart();
        this.createAgeGroupChart();
        this.createExposureCategoryChart();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    extractYears() {
      // Extract unique years excluding null and store them in availableYears
      const years = this.tableData
        .map(record => record.year)
        .filter(year => year !== null);
      this.availableYears = [...new Set(years)];  // Remove duplicates
    },
    setDefaultYear() {
      // Set selectedYear to the latest year in the availableYears array
      if (this.availableYears.length > 0) {
        this.selectedYear = Math.max(...this.availableYears);
      } else {
        this.selectedYear = 'all';  // Fallback if there are no years
      }
    },
    filterByYear() {
      if (this.selectedYear === 'all') {
        // When 'all' is selected, display all records
        this.tableData.forEach(record => {
          if (record.year === null) {
            record.year = 0;
            record.total_records = 0;
            record.male_count = 0;
            record.female_count = 0;
            record.age_under_15_count = 0;
            record.age_15_and_above_count = 0;
            record.expcateg_1_count = 0;
            record.expcateg_2_count = 0;
            record.expcateg_3_count = 0;
            record.booster_count = 0;
            record.expsource_cat_count = 0;
            record.expsource_dog_count = 0;
            record.expsource_others_count = 0;
            record.wash_0_count = 0;
            record.wash_1_count = 0;
          }
        });
        return;
      }

      this.tableData.forEach(record => {
        if (record.year !== this.selectedYear) {
          record.total_records = 0;
          record.male_count = 0;
          record.female_count = 0;
          record.age_under_15_count = 0;
          record.age_15_and_above_count = 0;
          record.expcateg_1_count = 0;
          record.expcateg_2_count = 0;
          record.expcateg_3_count = 0;
          record.booster_count = 0;
          record.expsource_cat_count = 0;
          record.expsource_dog_count = 0;
          record.expsource_others_count = 0;
          record.wash_0_count = 0;
          record.wash_1_count = 0;
        }
      });
    },
    computeTotals() {
      this.total = { 
        male: 0,
        female: 0,
        age_under_15: 0,
        age_15_and_above: 0,
        expcateg_1: 0,
        expcateg_2: 0,
        expcateg_3: 0,
        booster: 0,
        expsource_dog: 0,
        expsource_cat: 0,
        expsource_others: 0,
        wash_0: 0,
        wash_1: 0,
        total_records: 0
      };

      this.tableData.forEach(row => {
        this.total.male += row.male_count;
        this.total.female += row.female_count;
        this.total.age_under_15 += row.age_under_15_count;
        this.total.age_15_and_above += row.age_15_and_above_count;
        this.total.expcateg_1 += row.expcateg_1_count;
        this.total.expcateg_2 += row.expcateg_2_count;
        this.total.expcateg_3 += row.expcateg_3_count;
        this.total.booster += row.booster_count;
        this.total.expsource_dog += row.expsource_dog_count;
        this.total.expsource_cat += row.expsource_cat_count;
        this.total.expsource_others += row.expsource_others_count;
        this.total.wash_0 += row.wash_0_count;
        this.total.wash_1 += row.wash_1_count;
        this.total.total_records += row.total_records;
      });
    },
    exportToPDF() {
      nextTick(() => {
        const pdf = new jsPDF();
        // const pdf = new jsPDF('l', 'mm', 'a4');
        const table = this.$refs.table;

        if (!table) {
          console.error("Table reference not found.");
          return;
        }

        pdf.setFontSize(8);
        pdf.text('Department of Health - Center for Health Development', pdf.internal.pageSize.width / 2, 20, null, null, 'center');
        pdf.text('Rabies and Bite Victim', pdf.internal.pageSize.width / 2, 25, null, null, 'center');
        pdf.text('2025 Report', pdf.internal.pageSize.width / 2, 30, null, null, 'center');

        pdf.setFontSize(8);
        pdf.text('Reporting Unit: Olongapo City Animal Bite Treatment Center', 10, 50);

        html2canvas(table).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 190; 
          const pageHeight = pdf.internal.pageSize.height;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          const heightLeft = imgHeight;

          let position = 60;

          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          position += heightLeft;

          while (heightLeft >= pageHeight) {
            position = heightLeft - pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          }

          pdf.save('Rabies and Bite Victim.pdf');
        });
      });
    },

    createSexDistributionChart() {
      const ctx = document.getElementById('sexDistributionChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Male', 'Female'],
          datasets: [
            {
              label: 'Patients',
              data: [this.total.male, this.total.female],
              backgroundColor: ['#36A2EB', '#FF6384']
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      });
    },

    createAgeGroupChart() {
      const ctx = document.getElementById('ageGroupChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Under 15', 'Over 15'],
          datasets: [
            {
              label: 'Patients',
              data: [this.total.age_under_15, this.total.age_15_and_above],
              backgroundColor: ['#FFCE56', '#FF6384']
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      });
    },

    createExposureCategoryChart() {
      const ctx = document.getElementById('exposureCategoryChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Cat I', 'Cat II', 'Cat III'],
          datasets: [
            {
              label: 'Patients',
              data: [this.total.expcateg_1, this.total.expcateg_2, this.total.expcateg_3],
              backgroundColor: ['#4BC0C0', '#36A2EB', '#FFCE56']
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      });
    },
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
}
.yellow-column {
  background-color: #ffeb3b; /* Yellow for the total column */
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

.export-button {
  background-color: #188754; /* Bootstrap primary color */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 15px;
  transition: background-color 0.3s;
}

.export-button:hover {
  background-color: #0056b3; /* Darker shade */
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin: 40px 0 0 0;
  font-size: 0.9em;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.styled-table thead tr {
  background-color: #007BFF; /* Bootstrap primary color */
  color: #ffffff;
}

.styled-table th, .styled-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.table-row:hover {
  background-color: #f1f1f1; /* Light gray on hover */
}

.total-row {
  background-color: #ffeb3b; /* Yellow for totals */
  font-weight: bold;
}

tfoot td {
  font-weight: bold;
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.chart-row {
  display: flex;
  justify-content: space-between;
}

.chart {
  flex: 1;
  padding: 20px;
  text-align: center;
  background-color: #ffffff; /* Adds a background color */
  border-radius: 10px; /* Rounds the corners */
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1); /* Adds a soft shadow */
  transition: transform 0.2s ease; /* Adds a subtle hover effect */
}

.chart:hover {
  transform: translateY(-5px); /* Elevates the container on hover */
}

.chart h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #333; /* Optional: Adds a dark color for contrast */
}

canvas {
  width: 100%;
  height: auto;
  border-radius: 8px; /* Rounds the chart corners slightly */
}

.total-patients-container {
  background-color: #ffffff; /* White background for a clean look */
  border-radius: 12px; /* Rounds the corners */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  padding: 20px; /* Adds spacing around the content */
  margin-top: 20px; /* Adds some space above the container */
  text-align: center;
}

.total-patients-container h3 {
  font-size: 1.4em; /* Larger heading font */
  margin-bottom: 15px;
  color: #333; /* Darker color for the heading */
}

#totalPatientsBarChart {
  width: 100%;
  height: auto;
  border-radius: 8px; /* Slightly rounded corners on the chart */
}
</style>
