<template>
    <v-dialog 
    persistent
    v-model="dialog" 
    max-width="25%">
    <v-card-title>
        <span class="text-h5" style="font-weight: bold">Ocorreu um erro:</span>
        </v-card-title>
        <v-card-text>
            {{Error}}
        </v-card-text>
        <v-btn style="max-width:20px; left: 81%; margin-bottom: 5px;" color="red" @click="closeDialog()">
            OK
            </v-btn>
    </v-dialog>
</template>

<script>
export default {
    data: () => ({
        Error:  null,
        dialog: false
    }),
    methods: {
        closeDialog() {
            this.dialog = false;
        },
        showError(error) {
            if (error != null) {
                this.Error = error.errorMessage;
                this.dialog = true;
            }else {
                this.Error = "Houve um erro inesperado";
                this.dialog = true;
            }
        },
    },
}

</script>