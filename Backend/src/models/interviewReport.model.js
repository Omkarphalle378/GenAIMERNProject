const mongoose = require("mongoose")

/**
 * =>1.Which things user must be provide
 *   - Job decription :String
 *   - Resume:String
 *   - Self description:String
 * 
 * =>2.which things generate our platform?
 *   - Matchscore:Number
 *   - Technical Questions:
 *        [{
 *            questions: "",
 *            intention: "",
 *            answer:""
 *        }]
 *  
 *   - Behavioral Questions:
 *        [{
 *            questions: "",
 *            intention: "",
 *            answer:""
 *        }]
 * 
 *   - Skill Gap
 *        [{
 *            skill: "",
 *            severity:{
 *                  type:String,
 *                  enum:['low','medium','high']
 * 
 *                  }
 *        }]
 * 
 *    -Preperation plan
 *        day:Number
 *        focus:string
 *        task:[string]
 * 
 */
const technicalQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Technical question is required"]
  },
  intention: {
    type: String,
    required: [true, "Intention is required"]
  },
  answer: {
    type: String,
    required: [true, "Answer is required"]
  }
}, {
  _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Technical question is required"]
  },
  intention: {
    type: String,
    required: [true, "Intention is required"]
  },
  answer: {
    type: String,
    required: [true, "Answer is required"]
  }
}, {
  _id: false
})

const skillGapSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: [true, "Skill is required"]
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    required: [true, "severity is required"]
  }
}, {
  _id: false
})

const preparationPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: [true, "Day is required"]
  },

  focus: {
    type: String,
    required: [true, "Focus is required"]
  },
  task: [{
    type: String,
    required: [true, "Task is required"]
  }]


})

const interviewReportSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
    required: [true, "Job description is required"]
  },

  resume: {
    type: String
  },

  selfDescription: {
    type: String,
  },

  matchScore: {
    type: Number,
    min: 0,
    max: 100
  },

  technicalQuestions: [technicalQuestionSchema],
  behavioralQuestions: [behavioralQuestionSchema],
  skillGaps: [skillGapSchema],
  preparationPlan: [preparationPlanSchema],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }
}, {
  timestamps: true
})

const interviewReportModel = mongoose.model("interviewReport", interviewReportSchema)

module.exports = interviewReportModel