<template>
  <main>
    <div class="top-container">
      <h1 class="bg-title">Dashboard</h1>
      <div class="dashboard">
        <hr />
      </div>
    </div>
    <div class="wrapper">
            <!-- Slimmer greeting container with aligned text and overlapping image -->
            <div class="greeting-container">
        <div class="greeting-text">
          <h1>Good Morning!</h1>
          <p>Have a nice day at work</p>
        </div>
        <img src="@/assets/working.svg" alt="Person working on laptop" class="greeting-image" />
      </div>
      <div class="stats-cards">
        <div class="stat-card">
          <div class="icon-container">
            <i class="fas fa-user-check"></i>
          </div>
          <div class="text-container">
            <h2>No Dosage / Booster</h2>
            <span>{{ NoDosePatients }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon-container">
            <i class="fas fa-user-check"></i>
          </div>
          <div class="text-container">
            <h2>With One Dosage</h2>
            <span>{{ OneDosePatients }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon-container">
            <i class="fas fa-user-check"></i>
          </div>
          <div class="text-container">
            <h2>Follow-up Dosages</h2>
            <span>{{ FollowupPatients }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon-container">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="text-container">
            <h2>Scheduled Today</h2>
            <span>{{ todayPatients }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon-container">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="text-container">
            <h2>Queued Patients</h2>
            <span>{{ queuedPatients }}</span>
          </div>
        </div>
      </div>

      <div class="chart-appointment-container">
        <div class="chart-container">
          <div class="chart-content">
            <h5 class="chart-title">Patient Chart</h5>
            <canvas ref="patientSummaryChart"></canvas>
          </div>
        </div>

      
          <div class="card appointment-card with-border">
            <div class="card-header professional-header">
              <h5 class="card-title">Scheduled Today</h5>
            </div>
            <div class="card-body">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient Name</th>
                    <th>Address (in Olongapo)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(appointment, index) in todayAppointments" :key="index">
                    <th>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</th>
                    <td>{{ appointment.patient }}</td>
                    <td>{{ appointment.place }}</td>
                  </tr>
                </tbody>
              </table>
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
          </div>
        </div>
      </div>
  </main>
</template>



<script>
import Chart from 'chart.js/auto'; 
import axios from 'axios'; 

export default {
  data() {
    return {
      todayPatients: 0,
      NoDosePatients: 0,
      OneDosePatients: 0,
      FollowupPatients: 0,
      queuedPatients: 0,
      appointments: [],
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      users: [], 
    };
  },
  
  computed: {
    totalPages() {
      return Math.ceil(this.appointments.length / this.itemsPerPage);
    },
    filteredAppointments() {
      return this.paginatedAppointments.filter(appointment =>
        appointment.patient.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    paginatedAppointments() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.appointments.slice(start, start + this.itemsPerPage);
    },
    todayAppointmentsCount() {
    return this.appointments.filter(
      appointment => appointment.status.toLowerCase() === 'on going' 
    ).length;
  }
  },
  methods: {
    async fetchTodaysAppointments() {
      try {
        const recordResponse = await axios.get('http://127.0.0.1:8000/api/record');
        const userResponse = await axios.get('http://127.0.0.1:8000/api/user');
        
        this.users = userResponse.data;
        const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format

        console.log('Today\'s date:', today);
        
        // Filter appointments for today's dates (date3, date7, date28)
        this.todayAppointments = recordResponse.data
          .filter(patient => patient.status !== 4)
          .map(vaccinationRecord => {
            const user = this.users.find(user => user.user_id === vaccinationRecord.user_id);
            return {
              patient: `${user.fname} ${user.lname}`,
              place: vaccinationRecord.expplace,
              date3: vaccinationRecord.date3.split('T')[0],  // Strip time from date3
              date7: vaccinationRecord.date7.split('T')[0],  // Strip time from date7
              date28: vaccinationRecord.date28.split('T')[0], // Strip time from date28
              day3: vaccinationRecord.day3,
              day7: vaccinationRecord.day7,
              day28: vaccinationRecord.day28,
              status: vaccinationRecord.status
            };
          })
          .filter(appointment => 
          (appointment.date0 === today) ||
          (appointment.day3 === 0 && appointment.date3 === today) ||
          (appointment.day7 === 0 && appointment.date7 === today) ||
          (appointment.day28 === 0 && appointment.date28 === today)
          );

        console.log('Today\'s appointments:', this.todayAppointments);
        
        this.todayPatients = this.todayAppointments.length;
      } catch (error) {
        console.error('Error fetching today\'s appointments:', error);
      }
    },
    async fetchTotalPatients() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/record');
        if (response.data && Array.isArray(response.data)) {
          const today = new Date().toISOString().split('T')[0];
          this.todayPatients = response.data.filter(patient => {
            return patient.status !== 4 && 
              ((patient.date0 === today) ||
               (patient.day3 === 0 && patient.date3 === today) ||
               (patient.day7 === 0 && patient.date7 === today) ||
               (patient.day28 === 0 && patient.date28 === today));
          }).length;
          this.NoDosePatients = response.data.filter(patient => patient.status == 0).length;
          this.OneDosePatients = response.data.filter(patient => patient.status == 1).length;
          this.FollowupPatients = response.data.filter(patient => patient.status == 5 || patient.status == 3).length;
          this.queuedPatients = response.data.filter(patient => patient.status == 2).length;
        }
      } catch (error) {
        console.error('Error fetching total patients:', error);
      }
    },
    renderCharts() {
      this.renderPatientSummaryChart();
    },
    renderPatientSummaryChart() {
      const patientData = [
        this.NoDosePatients, 
        this.OneDosePatients, 
        this.FollowupPatients, 
        this.queuedPatients, 
        this.todayPatients
      ];
      const ctx = this.$refs.patientSummaryChart.getContext('2d');
      new Chart(ctx, {
        type: 'doughnut', // Pie Chart
        data: {
          labels: ['No Dosage', 'One Dosage', 'Follow-up Dosage', 'Queued Patients', 'Scheduled Today'],
          datasets: [
            {
              label: 'Patients Summary',
              backgroundColor: ['#4CAF50', '#FF9800', '#F44336', '#A84111', '#F34396'],
              data: patientData,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: 'white',
                font: {
                  size:14
                }
              }
            },
            tooltip: {
              enabled: true, // Enable tooltips for chart data
            },
          },
        },
      });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    statusClass(status) {
      return {
        'status-done': status === 'Done',
        'status-ongoing': status === 'On going',
      };
    },
  },
  mounted() {
    console.log('Mounted lifecycle hook triggered');
    this.$nextTick(() => {
      this.fetchTodaysAppointments().then(() => {
        console.log('Today\'s Appointments after fetch:', this.todayAppointments);
        this.fetchTotalPatients().then(() => {
          this.renderCharts();
        });
      });
    });
  },
};
</script>

<style>
/* Base styles */
.bg-title {
  z-index: -1;
  position: absolute;
  opacity: 10%;
  margin-top: -40px;
  font-size: 100px;
  top: 0;
  right: 0;
  margin: 0;
  font-family: Impact, fantasy;
  margin-right: 1rem;
}

.top-container {
  display: flex;
  margin: 0.5rem;
  padding-top: 2%;
  position: relative;
}
.greeting-container {
  display: flex;
  align-items: center;
  background: linear-gradient(145deg, #188754, #d6f6d5); /* Gradient background */
  padding: 40px;
  border-radius: 10px;
  margin: 20px 30px;
}
.greeting-text {
  text-align: left; /* Align text to the left */
  margin-left: 20px;
}
.greeting-text h1 {
  font-size: 2rem; /* Smaller font size */
  color: white;;
  margin: 0;
}

.greeting-text p {
  color: white;
  font-size: 1rem; /* Smaller font size */
  margin: 3px 0 0;
}

.greeting-image {
  position: absolute;
  right: -30px; /* Adjust as needed to control overlap */
  width: 300px; /* Increase width to make it larger */
  height: auto;
  margin-right: 15%;


}
.wrapper {
  overflow-y: hidden;
}
.dashboard {
  display: flex;
  align-items: center;
  flex: 1;
}

.dashboard .text {
  margin-left: 1rem;
  color: var(--dark);
  font-size: 1.5rem;
  font-weight: 900;
}

.dashboard i {
  color: var(--dark);
  font-size: 2.5rem;
  position: relative;
}

/* Improved Stats Card */
.stats-cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  background: linear-gradient(145deg, #188754, #d6f6d5); /* Gradient background */
  color: white; /* White text for better contrast */
  padding: 15px;
  border-radius: 15px; /* Rounder corners for a modern look */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Softer shadow for depth */
  width: 30%;
  position: relative;
  margin-left: 30px;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Animation for hover */
  margin-right: 20px
}

.stat-card:hover {
  transform: translateY(-5px); /* Slight lift on hover */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Deeper shadow on hover */
}

.icon-container {
  margin-right: 1rem;
  background-color: rgba(255, 255, 255, 0.2); /* Light transparent fill */
  width: 60px;
  height: 60px;
  border-radius: 10px; /* Rounded corners */
  display: flex;
  justify-content: center;
  align-items: center;
}


.text-container {
  text-align: left;
}

.text-container h2 {
  font-size: 1.5rem;
  margin-bottom: 5px;
  font-weight: bold;
  color: white;
  margin-top: 2%;
}

.text-container span {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.chart-appointment-container {
  display: flex; /* Aligns children in a row */
  justify-content: space-between; /* Space between elements */
  margin: 20px 20px 20px 0; /* Adjust margin to separate it */
  gap: 20px;
}

/* Chart Container Styles */
.chart-container {
  flex: 1; /* Allow the chart to grow and fill space */
  background: linear-gradient(145deg, #188754, #d6f6d5); /* Gradient background */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-right: 10px; /* Space between chart and appointment */
  margin-left: 30px;
}

/* Appointment Content Styles */
.appointment-content {
  flex: 1; /* Allow the appointment section to grow and fill space */
  background-color: white; /* Ensure the appointment card has a clean background */
  padding: 20px;
  border-radius: 15px; /* Keep rounded corners */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Soft shadow */
}

.chart-content {
  text-align: center;
  padding: 20px;
  margin-right: 10px; /* Add space between the chart and the appointment section */
}
.chart-title{
  color: white;
  font-size: 1.5rem;
  margin-top: 0%;
}
/* Improved Today's Appointments Card */
.appointment-card {
  flex: 1;
  background: linear-gradient(145deg, #188754, #d6f6d5); 
  padding: 20px;
  border-radius: 15px; /* Rounded corners */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Soft shadow */
}

.card-header {
  margin-bottom: 10px;
  border-bottom: 2px solid #ddd; /* Add a subtle underline to separate the header */
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: white; /* Darker text color for better readability */
  margin-top: 2%;
}

/* Table Styles */
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px; /* Adds spacing between rows */
}

.table th, .table td {
  padding: 12px 15px;
  text-align: left;
  font-size: 0.95rem; /* Slightly smaller font for better fit */
}

.table th {
  background-color: #f1f1f1; /* Light background for header */
  color: #333; /* Darker text for headers */
}

.table tbody tr {
  background-color: #fff; /* White background for rows */
  transition: background-color 0.3s ease; /* Smooth transition on hover */
}

.table tbody tr:hover {
  background-color: #f0f8ff; /* Light blue hover effect */
}

/* Status Styles */
.status {
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
}

.status-done {
  background-color: #4caf50;
}

.status-ongoing {
  background-color: #ff9800;
}

/* Pagination Styles */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* Spacing between pagination buttons */
}

.pagination button {
  padding: 8px 12px;
  border: none;
  background-color: #188754; /* Same blue as stat cards for consistency */
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background-color: #d6f6d5; /* Darker blue on hover */
}

.pagination button:disabled {
  background-color: #ccc; /* Disabled button styling */
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
  font-size: 1rem;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .stats-cards {
    flex-direction: column;
  }

  .stat-card {
    width: 100%;
    margin-bottom: 1rem;
  }
}
  @media (max-width: 1024px) {
  .chart-appointment-container {
    flex-direction: column;
  }

  .chart-container, .appointment-card {
    width: 100%;
    margin-bottom: 1rem;
  }
}

</style>
