<!-- updated vue 3 code -->



<template>
  <div>
    <!-- Modal import CSV -->
    <div>
      <nav class="container">
        <a href="#" @click="goBack()">&larr; Back</a>
      </nav>
      <div class="container" role="document">
        <div class="modal-content border-0">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">import from CSV</h5>
          </div>
          <div class="modal-body">
            <h3 class="text-muted">demo</h3>
            <div class="continer">
              <table class="table table-borderless text-capitalize">
                <thead>
                  <tr>
                    <th scope="col">date <br />(DD MMMMM YYYY)</th>
                    <th scope="col">names</th>
                    <th scope="col">phone number</th>
                    <th scope="col">project</th>
                    <th scope="col">pledged amount</th>
                    <th scope="col">amount payed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>23 July 2020</td>
                    <td>Daniel Jones</td>
                    <td>07********</td>
                    <td>church construction</td>
                    <td>300000</td>
                    <td>300</td>
                  </tr>
                  <tr>
                    <td>01 March 2020</td>
                    <td>Martha Mercy</td>
                    <td>07********</td>
                    <td>church construction</td>
                    <td>79000</td>
                    <td>300</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <hr />
            <h3 class="text-muted">your csv :</h3>
            <h3 class="text-muted">{{ get_data_status }}</h3>

            <div v-if="csv_data.length" style="height: 40vh; overflow-y: scroll">
              <table class="table table-borderless">
                <thead>
                  <tr v-for="(data, index) in csv_data.slice(0, 1)" :key="index">
                    <th scope="col" v-for="(value, key) in data" :key="key">
                      {{ key }}
                      <select class="form-control" v-model="csv_columns[key]">
                        <option selected>import as ...</option>
                        <option>date</option>
                        <option>names</option>
                        <option>phone number</option>
                        <option>project</option>
                        <option>pledge amount</option>
                        <option>amount</option>
                      </select>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(data, rowIndex) in csv_data" :key="rowIndex">
                    <td v-for="(value, key) in data" :key="key">{{ value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-3 large-12 medium-12 small-12 cell">
              <label><b>file: </b>
                <button class="mr-2 btn btn-success" @click="reset()">
                  Choose file
                </button>
                {{ file_name }}
                <input class="d-none" type="file" accept=".csv" id="file" ref="file"
                  @change="handleFileUpload()" />
              </label>
            </div>
            <p v-if="test_csv_errors.length">
              <ul>
                <small>
                  <li v-for="(error, index) in test_csv_errors" :key="index">
                    <p class="text-danger">{{ error }}</p>
                  </li>
                </small>
              </ul>
            </p>
            <p v-if="error_500.length">
              <ul>
                <small>
                  <li v-for="(error, index) in error_500" :key="index">
                    <p class="text-danger">unexpected data format in your file, make sure your CSV or EXCEL file matches the demo</p>
                    <p class="text-danger">select how you want to import your csv above</p>
                  </li>
                </small>
              </ul>
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success"
              @click="submitFile()"
              v-if="file">
              submit file
              <span v-if="submitting_file"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true">
              </span>
            </button>
            <button type="button" class="btn btn-success"
              v-if="uploaded_file.length !== 0"
              @click="checkCSV()">
              check CSV file
              <span v-if="checking_csv"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"></span>
            </button>
            <button type="button" class="btn btn-success"
              v-if="file_format_okay"
              @click="extractData()">
              extract Data
              <span v-if="extracting_data"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, reactive, defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'importPledgesFromCSV',
  setup(_, { emit }) {
    const file_name = ref("No file chosen");
    const submitting_file = ref(false);
    const checking_csv = ref(false);
    const extracting_data = ref(false);
    const extract_data_button_text = ref("import data");
    const file = ref(null);
    const error_500 = ref([]);
    const test_csv_errors = ref([]);
    const uploaded_file = ref('');
    const csv_data = ref([]);
    const get_data_status = ref('');
    const file_format_okay = ref(false);
    const csv_columns = reactive({});
    const fileInputRef = ref(null);

    const emitToParent = () => {
      emit('dataExtracted');
    };

    const goBack = () => {
      history.back();
    };

    const submitFile = () => {
      file_format_okay.value = false;
      error_500.value = [];
      test_csv_errors.value = [];
      let formData = new FormData();
      formData.append('csv', file.value);

      submitting_file.value = true;
      axios.post(`${import.meta.env.VITE_BASE_URL}/api/finance/upload-pledge-payments-csv/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          const data = response.data;
          if (!data.length) {
            uploaded_file.value = data.id;
            alert("file uploaded");
            previewCSV();
          }
          submitting_file.value = false;
        })
        .catch(err => {
          error_500.value.push(err);
          submitting_file.value = false;
        });
    };

    const handleFileUpload = () => {
      if (fileInputRef.value) {
        file.value = fileInputRef.value.files[0];
        file_name.value = file.value.name;
        uploaded_file.value = '';
        file_format_okay.value = false;
        fileInputRef.value.value = null;
      }
    };

    const previewCSV = () => {
      get_data_status.value = 'setting up preview ...';
      axios.get(`${import.meta.env.VITE_BASE_URL}/api/finance/preview-pledge-payments-csv/${uploaded_file.value}/`)
        .then(response => {
          csv_data.value = response.data;
          get_data_status.value = '';
        })
        .catch(() => {
          get_data_status.value = '';
        });
    };

    const checkCSV = () => {
      error_500.value = [];
      test_csv_errors.value = [];
      file_format_okay.value = false;

      checking_csv.value = true;
      axios.post(`${import.meta.env.VITE_BASE_URL}/api/finance/check-pledge-payments-csv/`, {
        file_id: uploaded_file.value,
        column_config: csv_columns
      })
        .then(response => {
          const data = response.data;
          if (!data.length) {
            file_format_okay.value = true;
          } else {
            test_csv_errors.value = data;
          }
          checking_csv.value = false;
        })
        .catch(err => {
          error_500.value.push(err);
          checking_csv.value = false;
        });
    };

    const extractData = () => {
      extract_data_button_text.value = "extracting...";
      extracting_data.value = true;
      axios.post(`${import.meta.env.VITE_BASE_URL}/api/finance/import-pledge-payments-data-from-csv/`, {
        file_id: uploaded_file.value,
        column_config: csv_columns
      })
        .then(() => {
          alert("data extracted successfully");
          reset();
        })
        .catch(() => {
          reset();
          alert("an error occurred, check CSV and try again");
        });
    };

    const reset = () => {
      submitting_file.value = false;
      checking_csv.value = false;
      extracting_data.value = false;
      extract_data_button_text.value = "import data";
      error_500.value = [];
      test_csv_errors.value = [];
      uploaded_file.value = '';
      csv_data.value = [];
      get_data_status.value = '';
      file_format_okay.value = false;
      Object.keys(csv_columns).forEach(key => delete csv_columns[key]);
      file.value = null;
      file_name.value = "No file chosen";
      document.getElementById('file').click();
    };

    return {
      file_name,
      submitting_file,
      checking_csv,
      extracting_data,
      extract_data_button_text,
      file,
      error_500,
      test_csv_errors,
      uploaded_file,
      csv_data,
      get_data_status,
      file_format_okay,
      csv_columns,
      fileInputRef,
      emitToParent,
      goBack,
      submitFile,
      handleFileUpload,
      previewCSV,
      checkCSV,
      extractData,
      reset
    };
  }
});
</script>
