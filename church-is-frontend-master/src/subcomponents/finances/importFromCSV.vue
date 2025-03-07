



//updated vue 3 code

<!-- Parent.vue -->
<template>
  <div>
    <!-- Modal import CSV -->
    <div class="modal fade bd-example-modal-xl" id="importFromCSV" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">import from CSV</h5>
            <button type="button" id="close-button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h3 class="text-muted">demo</h3>
            <div class="container">
              <table class="table table-borderless text-capitalize">
                <thead>
                  <tr>
                    <th scope="col">date <br/>(DD MMMMM YYYY)</th>
                    <th scope="col">names</th>
                    <th scope="col">phone number</th>
                    <th scope="col">type</th>
                    <th scope="col">method</th>
                    <th scope="col">amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>23 July 2020</td>
                    <td>Daniel Jones</td>
                    <td>07********</td>
                    <td>tithe</td>
                    <td>Mpesa</td>
                    <td>300</td>
                  </tr>
                  <tr>
                    <td>01 March 2020</td>
                    <td>Martha Mercy</td>
                    <td>07********</td>
                    <td>Offering</td>
                    <td>cash</td>
                    <td>300</td>
                  </tr>
                </tbody>
              </table>
              <hr/>
              <h3 class="text-muted">your csv :</h3>
              <h3 class="text-muted">{{ get_data_status }}</h3>

              <div v-if="csv_data.length" style="height: 40vh; overflow-y: scroll">
                <table class="table table-borderless">
                  <thead>
                    <tr v-for="data in csv_data.slice(0, 1)" :key="data">
                      <th scope="col" v-for="(value, key) in data" :key="key">
                        {{ key }}
                        <select class="form-control" v-model="csv_columns[key]">
                          <option selected>import as ...</option>
                          <option>date</option>
                          <option>names</option>
                          <option>phone number</option>
                          <option>type</option>
                          <option>payment method</option>
                          <option>amount</option>
                        </select>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(data, index) in csv_data" :key="index">
                      <td v-for="(value, key) in data" :key="key">{{ value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="mt-3 large-12 medium-12 small-12 cell">
                <label><b>file: </b>
                  <button class="mr-2 btn btn-light" @click="reset()">
                    Choose file
                  </button>
                  {{ file_name }}
                  <input class="d-none" type="file" accept=".csv" id="file" ref="file" @change="handleFileUpload()" />
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
              <p class="text-success" v-if="file_format_okay">file okay, proceed to import</p>
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
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-success" @click="submitFile()" v-if="file">
              submit file
              <span v-if="submitting_file" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            </button>
            <button type="button" class="btn btn-success" v-if="uploaded_file.length != 0" @click="checkCSV()">
              check CSV file
              <span v-if="checking_csv" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            </button>
            <button type="button" class="btn btn-success" v-if="file_format_okay" @click="extractData()">
              extract Data
              <span v-if="extracting_data" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'importFromCSV',
    data() {
        return {
            file_name: "No file chosen",
            submitting_file: false,
            checking_csv: false,
            extracting_data: false,
            extract_data_button_text: "import data",
            file: null,
            error_500: [],
            test_csv_errors: [],
            uploaded_file: '',
            csv_data: [],
            get_data_status: '',
            file_format_okay: false,
            csv_columns: {},
        };
    },
    emits: ['dataExtracted'],
    methods: {
        emitToParent() {
            this.$emit('dataExtracted');
        },
        submitFile() {
            this.file_format_okay = false;
            this.error_500 = [];
            this.test_csv_errors = [];
            let formData = new FormData();
            formData.append('csv', this.file);

            this.submitting_file = true;
            this.$http.post(this.$BASE_URL + '/api/finance/upload-csv/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                var data = response.data;
                if (!data.length) {
                    this.uploaded_file = data.id;
                    alert("file uploaded");
                    this.previewCSV();
                }
                this.submitting_file = false;
            })
            .catch(err => {
                this.error_500.push(err);
                this.submitting_file = false;
            });
        },
        handleFileUpload() {
            this.file = this.$refs.file.files[0];
            this.file_name = this.file.name;
            this.uploaded_file = '';
            this.file_format_okay = false;
            this.$refs.file.value = null;
        },
        previewCSV() {
            this.get_data_status = 'setting up preview ...';
            this.$http.get(this.$BASE_URL + '/api/finance/preview-csv/' + this.uploaded_file + '/')
            .then(response => {
                this.csv_data = response.data;
                this.get_data_status = '';
            })
            .catch(() => {
                this.get_data_status = '';
            });
        },
        checkCSV() {
            this.error_500 = [];
            this.test_csv_errors = [];
            this.file_format_okay = false;
            this.checking_csv = true;

            this.$http.post(this.$BASE_URL + '/api/finance/check-csv/', {
                file_id: this.uploaded_file,
                column_config: this.csv_columns
            })
            .then(response => {
                var data = response.data;
                if (!data.length) {
                    this.file_format_okay = true;
                } else {
                    this.test_csv_errors = data;
                }
                this.checking_csv = false;
            })
            .catch(err => {
                this.error_500.push(err);
                this.checking_csv = false;
            });
        },
        extractData() {
            this.extract_data_button_text = "extracting...";
            this.extracting_data = true;

            this.$http.post(this.$BASE_URL + '/api/finance/import-data-from-csv/', {
                file_id: this.uploaded_file,
                column_config: this.csv_columns
            })
            .then(() => {
                this.extract_data_button_text = "import data";
                this.updateListVersions();
                this.emitToParent();
                document.getElementById('close-button').click();
                alert("data extracted successfully");
                this.extracting_data = false;
            })
            .catch(() => {
                this.extract_data_button_text = "import data";
                this.updateListVersions();
                this.emitToParent();
                document.getElementById('close-button').click();
                alert("data extracted successfully");
                this.extracting_data = false;
            });
        },
        updateListVersions() {
            ['member_list_version', 'tithe_list_version', 'offering_list_version'].forEach(item => {
                let new_version = parseInt(localStorage.getItem(item)) + 1;
                this.$store.dispatch(`update_${item}`, new_version);
            });
        },
        reset() {
            this.submitting_file = false;
            this.checking_csv = false;
            this.extracting_data = false;
            this.extract_data_button_text = "import data";
            this.error_500 = [];
            this.test_csv_errors = [];
            this.uploaded_file = '';
            this.csv_data = [];
            this.get_data_status = '';
            this.file_format_okay = false;
            this.csv_columns = {};
            this.file = null;
            this.file_name = "No file chosen";
            document.getElementById('file').click();
        }
    }
};
</script>
