const mongoose = require('mongoose')
const Autoincrement = require('mongoose-sequence')(mongoose)

const sponsorSchema = new mongoose.Schema({
    sponsor_name: {
        type: String,
        required: true
    },
    E_mail_id: {
        type: String,
        required: true
    },
    Contact_no: {
        type: String,
        required: true
    },
    Gender: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    Age: {
        type: Number,
        required: true
    },
    Child_count: {
        type: Number,
        required: true
    },
    Sponsored_child: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref:'Students'
    }],
    payment_status: {
        type: Boolean,
        required: true
    },
    active_status: {
        type: Boolean,
        required: true
    }
})

/*
studentsSchema.plugin(Autoincrement, {
    inc_feild: 'roll_seq',
    id: 'Studentnums',
    start_seq: 1
})

studentSchema.pre('save', function (next) {
    this.Roll_number = `K/DHN/${this.Centre}-${String(this.rollNumberSeq)}`
    next()
  })
*/

module.exports = mongoose.model('Sponsor', sponsorSchema)