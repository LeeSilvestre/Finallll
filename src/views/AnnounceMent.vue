<template>
  <main>
    <div class="top-container">
      <h1 class="bg-title">Announcements</h1>
      <div class="patient">
        <span class="text">Announcements</span>
        <i class="fas fa-bullhorn"></i>
        <hr />
      </div>
      <button 
        v-if="!activeAnnouncementExists"
        @click="showForm = true" 
        class="add-post-button" >
        Add Post
      </button>
      <button 
        v-else 
        @click="openEditForm" 
        class="add-post-button">
        Edit Post
      </button>
    </div>

    <div class="content-container">
      <div class="add-post-container">
        <div v-if="showForm" class="modal">
          <div class="modal-content">
            <span class="close-button" @click="closeForm">&times;</span>
            <h2>{{ isEditing ? 'Edit Announcement' : 'Post an Announcement' }}</h2>
            <form @submit.prevent="isEditing ? updateAnnouncement() : postAnnouncement()">
              <div class="form-group">
                <label for="message">Content:</label>
                <textarea id="message" v-model="formAnnouncement.message" required></textarea>
              </div>
              <div class="form-group">
                <label for="ann_exp">Expiry Date:</label>
                <input 
                  type="date" 
                  id="ann_exp" 
                  v-model="formAnnouncement.ann_exp"
                  :min="minDate" 
                  required 
                />
              </div>
              <div class="form-buttons">
                <button type="submit" class="save-button">Save</button>
                <button type="button" @click="closeForm" class="cancel-button">Cancel</button>
                
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="announcements-display">
        <div v-if="announcements.length === 0 || !activeAnnouncementExists">No announcements yet.</div>
        <div v-for="announcement in announcements.filter(a => a.is_active === 0)" :key="announcement.id" class="announcement">
          <h3>{{ announcement.message }}</h3>
          <p>Expires on: {{ formatDate(announcement.ann_exp) }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      showForm: false,
      newAnnouncement: {
        message: '',
        ann_exp: ''
      },
      isEditing: false,
      formAnnouncement: {
        id: null,
        message: '',
        ann_exp: ''
      },
      announcements: [],
    };
  },
  computed: {
    activeAnnouncementExists() {
    return this.announcements.some((announcement) => announcement.is_active === 0);
  },
    minDate() {
      return new Date().toISOString().split('T')[0];
    }
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    fetchAnnouncements() {
      axios.get('http://127.0.0.1:8000/api/announcement')
        .then((response) => {
          console.log('Fetched Announcements:', response.data);
          this.announcements = response.data;
        })
        .catch((error) => {
          console.error('Error fetching announcements:', error);
        });
    },
    postAnnouncement() {
      const today = new Date().toISOString().split('T')[0];

      if (this.formAnnouncement.ann_exp <= today) {
        Swal.fire('Error', 'The expiry date cannot be today or in the past.', 'error');
        return;
      }

      Swal.fire({
        title: 'Confirm Post',
        text: 'Are you sure you want to post this announcement?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Post it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post('http://127.0.0.1:8000/api/announcement', this.formAnnouncement)
            .then(() => {
              Swal.fire('Success', 'Announcement posted successfully!', 'success')
                .then(() => window.location.reload());
            })
            .catch(error => {
              Swal.fire('Error', 'Failed to post announcement.', 'error');
              console.error('Error posting announcement:', error);
            });
        }
      });
    },
    openEditForm() {
      const activeAnnouncement = this.announcements.find((announcement) => announcement.is_active === 0);
      if (activeAnnouncement) {
        console.log('Editing announcement:', activeAnnouncement);
        this.formAnnouncement = { ...activeAnnouncement };
        this.isEditing = true;
        this.showForm = true;
      }
    },
    updateAnnouncement() {
      Swal.fire({
        title: 'Confirm Update',
        text: 'Are you sure you want to update this announcement?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Update it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.put(`http://127.0.0.1:8000/api/announcement/${this.formAnnouncement.ann_id}`, {
            message: this.formAnnouncement.message,
            ann_exp: this.formAnnouncement.ann_exp
          })
          .then(() => {
            Swal.fire('Updated!', 'The announcement has been updated.', 'success');
            this.showForm = false;
            this.isEditing = false;
            this.fetchAnnouncements();
          })
          .catch(error => {
            Swal.fire('Error', 'Failed to update announcement.', 'error');
            console.error('Error updating announcement:', error);
          });
        }
      });
    },
    closeForm() {
      this.showForm = false;
      this.isEditing = false;
      this.formAnnouncement = { id: null, message: '', ann_exp: '' };
    },
  },
  mounted() {
    this.fetchAnnouncements();
  }
};
</script>

<style scoped>
/* General container styles */
.main {
  font-family: 'Roboto', sans-serif;
  background-color: #f9fafb;
  padding: 20px;
}

/* Top container and title styling */
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

.content-container {
  margin-top: 20px;
}

/* Add Post Button Styling */
.add-post-button {
  padding: 10px 25px;
  background-color: #188754;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  margin-top: 2%;
}

.add-post-button:hover {
  background-color: #0056b3;
}

/* Modal styling */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.7);
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Close button styling */
.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
}

.close-button:hover {
  color: #000;
}

/* Form styling */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
  background-color: #f9fafb;
  transition: border 0.3s ease;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  border-color: #007bff;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

/* File input styling */
.form-group input[type="file"] {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  background-color: #f9fafb;
}

/* Preview image */
.image-preview img {
  max-width: 100%;
  height: auto;
  margin-top: 1rem;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Form buttons */
.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-buttons .cancel-button,
.form-buttons .save-button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.form-buttons .cancel-button {
  background-color: #6c757d;
  color: white;
}

.form-buttons .cancel-button:hover {
  background-color: #5a6268;
}

.form-buttons .save-button {
  background-color: #28a745;
  color: white;
}

.form-buttons .save-button:hover {
  background-color: #218838;
}

/* Announcement display */
.announcements-display {
  margin-top: 2rem;
}

.announcement {
  padding: 15px;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  transition: box-shadow 0.3s ease;
}

.announcement:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.announcement h3 {
  margin-bottom: 10px;
  font-size: 1.5rem;
  color: #333;
}

.announcement p {
  font-size: 1rem;
  color: #555;
}

.announcement img {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  border-radius: 5px;
}
</style>
