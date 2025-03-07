
<!-- updated vue3 code -->
<template>
	<div>
		<!-- EXPENDITURE CONTENTS -->
		<div>
			<h3 class="font-weight-bold">Expenditure</h3>
			<br>
			<div class="mt-5 text-muted" v-if="expenditure_stats">
					<div class="d-flex d-flex-row justify-content-start">
							<div class="d-none d-lg-block stat-item mr-2 text-muted">
									This month  <span class="text-secondary font-weight-bold">
									 Ksh {{ humanize(expenditure_stats.total_this_month) }}</span>
							</div>
							<div class="d-none d-lg-block stat-item mr-2">
									This year  <span class="text-secondary font-weight-bold">
									Ksh {{ humanize(expenditure_stats.total_this_year) }}</span>
							</div>
							<a class="ml-2 btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="collapse" href="#statsTab" role="button" aria-expanded="false" aria-controls="statsTab">
									more stats
							</a>
							 <!-- when on a small device show this button -->
							 <div class="ml-3 d-sm-block d-md-none btn-group">
									<button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addOffering">
											Add expenditure type
									</button>
							</div>
					</div>
					<div class="collapse" id="statsTab">
							<div class="card card-body outline-0">
								<expenditurestats msg="expenditure stats"/>
							</div>
					</div>
				</div>
			<table class="mt-5 table table-responsive-sm table-borderless">
				<thead>
					<tr>
						<th>type</th>
						<th>created</th>
						<th>this month</th>
						<th>this year</th>
					</tr>
				</thead>
				<p class="mt-4 col-8">
					<span class="badge badge-pill badge-secondary">{{ found_expenditure_types }}</span> entries found
				</p>
				<tbody>
					<tr v-for="data in expenditure_types.response" :key="data.id">
						<td>
							<router-link class="text-muted"  :to="`/expenditure/` + data.id + `/`">
								{{ data.type_name }}
							</router-link>
						</td>
						<td>{{ humanizeDate(data.created) }}</td>
						<td><p class="text-secondary">{{ humanize(data.total_this_month) }}</p></td>
						<td><p>{{ humanize(data.total_this_year) }}</p></td>
						<td>
							<router-link class="text-muted" style="text-decoration: none;" :to="`/expenditure/` + data.id + `/`">
								<img style="width: 20px; height: auto" src="@/assets/icons/icons8-right-arrow-50.png">
							</router-link>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Add expenditure type modal -->
		<div class="modal fade" id="addExpenditureType" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Add expenditure type</h5>
						<button id="closeAddExpenditureTypeModalButton" type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form>
							<div class="row form-group">
								<label class="col-3"><b>Name:</b></label>
								<input type="text" class="col-8 form-control" placeholder="Give a name" v-model="expenditure_type_name">
								<p v-if="expenditure_type_name_errors.length">
									<ul>
										<small><li v-for="error in expenditure_type_name_errors" :key="error"><p class="text-danger">{{ error }}</p></li></small>
									</ul>
								</p>
							</div>
							<div class="row form-group">
								<label class="col-3"><b>Total allocation:</b></label>
								<input type="number" class="col-8 form-control" v-model="expenditure_allocation">
							</div>
							<div class="row form-group">
								<label class="col-3"><b>Describe:</b></label>
								<textarea class="col-8 form-control" rows="3" v-model="expenditure_type_description"></textarea>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-success" @click="addExpenditureType()">
							<b>+</b> Add expenditure type
							<span v-if="adding_expenditure" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Export to CSV format -->
		<div class="modal fade" id="exportEpenditureToCSV" tabindex="-1" role="dialog" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Export expenditure data to CSV</h5>
						<button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form>
							<div class="form-group">
								<div class="row">
									<label class="col-3"><b>Date</b></label>
									<div class="input-group form-group col-5" style="padding: 0px">
										<input type="date" name="bday" max="3000-12-31" min="1000-01-01" class="form-control" v-model="csv_date">
									</div>
								</div>
								<div class="row">
									<label class="col-3"></label>
									<div class="input-group form-group col-5" style="padding: 0px">
										<small>Export data is from selected date's month</small>
									</div>
								</div>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-success" @click="exportData()">
							Download CSV
							<span v-if="exporting_data" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>



<script>
import expenditurestats from '@/subcomponents/statistics/expenditurestats.vue'
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

export default {
	name: 'expenditures',
	components: { expenditurestats },
	props: {
		msg: String
	},
	setup() {
		const store = useStore()

		const fetch_data_error = ref([])
		const adding_expenditure = ref(false)
		const found_expenditure_types = ref(0)
		const expenditure_types = ref(null)
		const expenditure_stats = ref(null)
		const expenditure_type_name = ref('')
		const expenditure_allocation = ref(0.00)
		const expenditure_type_description = ref('')
		const expenditure_type_name_errors = ref([])
		const csv_date = ref('')
		const exporting_data = ref(false)

		const humanize = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

		const getExpenditures = () => {
			expenditure_stats.value = JSON.parse(localStorage.getItem('expenditure_stats'))
			expenditure_types.value = JSON.parse(localStorage.getItem('expenditure_type_list'))
			if (expenditure_types.value) {
				found_expenditure_types.value = expenditure_types.value.response.length
			}

			const currentVersion = store.getters.expenditure_list_version
			const version = localStorage.getItem('expenditure_list_version')

			store.dispatch('update_isLoading', true)
			axios.get(`${store.state.BASE_URL}/api/finance/expenditure-stats/`)
				.then(response => {
					expenditure_stats.value = response.data
					localStorage.setItem('expenditure_stats', JSON.stringify(response.data))
					store.dispatch('update_isLoading', false)
				})
				.catch(err => {
					fetch_data_error.value.push(err)
					store.dispatch('update_isLoading', false)
				})

			store.dispatch('update_isLoading', true)
			axios.get(`${store.state.BASE_URL}/api/finance/expenditure-type-list/`)
				.then(response => {
					expenditure_types.value = { response: response.data }
					localStorage.setItem('expenditure_type_list', JSON.stringify({ response: response.data }))
					localStorage.setItem('expenditure_list_version', currentVersion)
					found_expenditure_types.value = response.data.length
					store.dispatch('update_isLoading', false)
				})
				.catch(err => {
					fetch_data_error.value.push(err)
					store.dispatch('update_isLoading', false)
				})
		}

		const expenditureTypeFormOK = () => {
			expenditure_type_name_errors.value = []
			if (expenditure_type_description.value.length < 1) {
				expenditure_type_description.value = "none given"
			}
			if (expenditure_type_name.value.length > 0) {
				return true
			}
			if (expenditure_type_name.value.length < 1) {
				expenditure_type_name_errors.value.push("name required")
				return false
			}
		}

		const addExpenditureType = () => {
			if (expenditureTypeFormOK()) {
				adding_expenditure.value = true
				axios.post(`${store.state.BASE_URL}/api/finance/expenditure-type-list/`, {
					type_name: expenditure_type_name.value,
					total_available: expenditure_allocation.value,
					description: expenditure_type_description.value
				})
				.then(response => {
					adding_expenditure.value = false
					expenditure_type_name.value = ''
					expenditure_type_description.value = ''
					const new_version = parseInt(localStorage.getItem('expenditure_list_version')) + 1
					store.dispatch('update_expenditure_list_version', new_version)
					document.getElementById('closeAddExpenditureTypeModalButton').click()
					getExpenditures()
				})
				.catch(err => {
					adding_expenditure.value = false
					alert("an error occurred, try again later")
				})
			}
		}

		const exportData = () => {
			exporting_data.value = true
			axios.get(`${store.state.BASE_URL}/api/finance/get-expenditure-csv/${csv_date.value}/`)
				.then(response => {
					store.dispatch('fileDownload', { data: response.data, filename: `expenditures_${csv_date.value}.csv` })
					exporting_data.value = false
					alert("download successful")
				})
				.catch(error => {
					exporting_data.value = false
					alert('error while downloading expenditure csv')
				})
		}

		onMounted(() => {
			getExpenditures()
		})

		return {
			fetch_data_error,
			adding_expenditure,
			found_expenditure_types,
			expenditure_types,
			expenditure_stats,
			expenditure_type_name,
			expenditure_allocation,
			expenditure_type_description,
			expenditure_type_name_errors,
			csv_date,
			exporting_data,
			humanize,
			getExpenditures,
			expenditureTypeFormOK,
			addExpenditureType,
			exportData
		}
	}
}
</script>

