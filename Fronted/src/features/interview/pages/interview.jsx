// import React, { useState, useEffect, useRef } from "react";
// import "../style/interview.scss";
// import { useInterview } from "../hooks/useInterview";
// import { useParams } from "react-router-dom";


// // const interviewData = {
// //   matchScore: 88,
// //   technicalQuestions: [
// //     {
// //       id: 1,
// //       question:
// //         "Explain the difference between the MongoDB and MySQL databases, and give an example of how each is used.",
// //       intention:
// //         "Understand the interviewer's ability to explain technical concepts in a clear and concise manner.",
// //       answer:
// //         "MongoDB is a NoSQL database that stores data in JSON-like documents and is highly scalable and flexible. MySQL is a relational SQL database that stores structured data in tables. MongoDB is ideal for semi-structured or unstructured data, while MySQL is used when strong schema and ACID transactions are required."
// //     },
// //     {
// //       id: 2,
// //       question:
// //         "Describe the Node.js architecture and explain how it handles asynchronous operations.",
// //       intention:
// //         "Test the interviewer's understanding of Node.js architecture and ability to explain how it handles asynchronous operations.",
// //       answer:
// //         "Node.js is a JavaScript runtime environment built on Chrome's V8 engine. It uses an event-driven, non-blocking I/O model. When requests arrive, Node.js places callbacks into an event loop and executes them as I/O operations complete, enabling concurrency without blocking the main thread."
// //     },
// //     {
// //       id: 3,
// //       question: "Explain the purpose of REST API and how it is used in web application development.",
// //       intention:
// //         "Test the interviewer's knowledge of REST API and its role in web application development.",
// //       answer:
// //         "REST API is an architectural style for building stateless web services that communicate over HTTP. It enables clients and servers to exchange data using standard verbs like GET, POST, PUT, and DELETE. REST APIs are used to build scalable and modular web applications by separating frontend and backend responsibilities."
// //     },
// //     {
// //       id: 4,
// //       question:
// //         "How can you optimize the performance of a web application? Give an example of each optimization technique.",
// //       intention:
// //         "Test the interviewer's ability to explain optimization techniques and their impact on application performance.",
// //       answer:
// //         "Performance can be improved with caching, compression, efficient algorithms, and optimized data access patterns. For example, caching API responses reduces server load, and indexing database queries improves query response time."
// //     },
// //     {
// //       id: 5,
// //       question: "Describe the role of React.js in building user interfaces in web applications.",
// //       intention:
// //         "Test the interviewer's understanding of React.js and its role in building user interfaces.",
// //       answer:
// //         "React.js is a library for building reusable UI components. It uses a virtual DOM to update only the necessary parts of the interface, which improves performance. React helps developers build maintainable and interactive frontends with component-driven architecture."
// //     }
// //   ],
// //   behavioralQuestions: [
// //     {
// //       id: 1,
// //       question:
// //         "Describe a situation where you had to handle an error in a MERN stack application.",
// //       intention:
// //         "Test the interviewer's ability to describe how to handle an error in a MERN stack application and what steps they would take to recover from the error.",
// //       answer:
// //         "First I identify the source of the error and inspect the logs. Then I analyze the error message, debug the relevant code path, implement a fix, and test the fix end to end. Finally, I add validation or error handling to prevent the same issue in the future."
// //     },
// //     {
// //       id: 2,
// //       question:
// //         "Explain how you would design a scalable and secure web application using the MERN stack.",
// //       intention:
// //         "Test the interviewer's ability to design a scalable and secure web application using the MERN stack.",
// //       answer:
// //         "I would use MongoDB for flexible data storage, Express and Node.js for API handling, and React for the frontend. I would protect endpoints with JWT authentication, use HTTPS, validate input, and adopt a layered architecture with caching and monitoring for scalability."
// //     },
// //     {
// //       id: 3,
// //       question:
// //         "Describe a project where you used the MERN stack to build a full-stack web application.",
// //       intention:
// //         "Test the interviewer's ability to describe a project where they used the MERN stack to build a full-stack web application.",
// //       answer:
// //         "I led the development of a real-time collaboration tool using MongoDB for storage, Express and Node for APIs, and React for the interface. We built authentication, chat, and file sharing features, then deployed the app to a cloud platform with CI/CD."
// //     },
// //     {
// //       id: 4,
// //       question: "Explain your approach to unit testing in a MERN stack application.",
// //       intention:
// //         "Test the interviewer's understanding of unit testing and their ability to explain their approach to unit testing in a MERN stack application.",
// //       answer:
// //         "I write isolated tests for services and components, mock dependencies, and verify expected behavior. I also combine those with integration tests for API endpoints to ensure the full stack works together."
// //     },
// //     {
// //       id: 5,
// //       question:
// //         "Describe your experience working in a team environment using the MERN stack.",
// //       intention:
// //         "Test the interviewer's ability to describe their experience working in a team environment using the MERN stack.",
// //       answer:
// //         "I collaborated with developers using Git, code reviews, and a CI/CD pipeline. We shared tasks, maintained clear documentation, and aligned on architecture decisions to deliver a stable product."
// //     }
// //   ],
// //   skillGaps: ["redis", "Message queue", "Event loop"],
// //   preparationPlan: [
// //     {
// //       day: 1,
// //       focus: "MERN Stack Fundamentals",
// //       tasks: [
// //         "Read and understand the basics of the MERN stack, including MongoDB, Express.js, React.js, and Node.js.",
// //         "Use online resources such as MDN Web Docs, and freecodecamp tutorials to gain a foundational understanding of these technologies.",
// //         "Complete beginner-level coding exercises on platforms like HackerRank and freeCodeCamp to solidify your understanding."
// //       ]
// //     },
// //     {
// //       day: 2,
// //       focus: "MongoDB Basics",
// //       tasks: [
// //         "Get familiar with MongoDB by understanding its data model, queries, and basic operations.",
// //         "Use online tutorials and interactive courses on MongoDB Atlas to learn how to set up and manage a MongoDB instance.",
// //         "Practice connecting to a MongoDB instance using a code editor and performing basic CRUD operations."
// //       ]
// //     },
// //     {
// //       day: 3,
// //       focus: "Express.js Fundamentals",
// //       tasks: [
// //         "Learn the basics of Node.js, including event-driven programming, asynchronous functions, and modules.",
// //         "Use online tutorials and code examples to understand how to set up a Node.js server and handle HTTP requests.",
// //         "Build simple REST API endpoints using Express.js to practice working with JSON data."
// //       ]
// //     },
// //     {
// //       day: 4,
// //       focus: "React.js Basics",
// //       tasks: [
// //         "Get comfortable with JavaScript syntax and learn the fundamentals of React.js, including components, state management, and JSX.",
// //         "Use online tutorials and resources like freeCodeCamp to learn about React's virtual DOM and how to build components.",
// //         "Build simple React applications using create-react-app and practice managing state and rendering UI elements."
// //       ]
// //     },
// //     {
// //       day: 5,
// //       focus: "REST API Integration",
// //       tasks: [
// //         "Learn about REST APIs and their importance in building full-stack applications. Use online tutorials to understand how to design and implement REST API endpoints.",
// //         "Connect MongoDB to your Express.js server and perform CRUD (create, read, update, and delete) operations using the MERN stack.",
// //         "Practice building a simple API using Node.js and Express.js that interacts with MongoDB."
// //       ]
// //     },
// //     {
// //       day: 6,
// //       focus: "Database Design and Optimization",
// //       tasks: [
// //         "Learn about relational databases and the importance of database design. Use online resources and practice building databases using MySQL and MongoDB.",
// //         "Optimize your MongoDB database for better performance by understanding indexing and queries.",
// //         "Implement proper database security practices to protect sensitive data and prevent unauthorized access."
// //       ]
// //     },
// //     {
// //       day: 7,
// //       focus: "Project Work",
// //       tasks: [
// //         "Work on a real-world full-stack web application using the MERN stack. Focus on designing, building, and testing a complete web application.",
// //         "Choose a specific project from the job description and apply the knowledge and skills you have acquired during the preparation phase.",
// //         "Document your project in a clear and concise manner using tools like GitHub repositories and README files."
// //       ]
// //     }
// //   ]
// // };

// const Interview = () => {
//   const { report, getReportById, loading, getResumePdf } = useInterview()
//   const { interviewId } = useParams()
//   const [active, setActive] = useState("technical");
//   const mainRef = useRef(null);
//   useEffect(() => {
//     const container = mainRef.current;
//     if (!container) return;

//     // ✅ THIS LINE FIXES YOUR ISSUE

//     const handleScroll = () => {
//       const technical = document.getElementById("technical");
//       const behavioral = document.getElementById("behavioral");


//       if (!technical || !behavioral) return;

//       const containerTop = container.getBoundingClientRect().top;
//       const behTop = behavioral.getBoundingClientRect().top - containerTop;

//       const scrollPosition = container.scrollTop + 120;

//       if (scrollPosition >= behTop) {
//         setActive("behavioral");
//       } else {
//         setActive("technical");
//       }
//     };

//     container.addEventListener("scroll", handleScroll);
//     handleScroll();

//     return () => container.removeEventListener("scroll", handleScroll);
//   }, []);
//   const {
//     matchScore = 0,
//     technicalQuestions = [],
//     behavioralQuestions = [],
//     skillGaps = [],
//     preparationPlan = []
//   } = report || {};

//   return (
//     <section className="interview-page interview-detail-page">
//       <div className="interview-detail-card">
//         <div className="detail-grid">
//           <aside className="detail-sidebar">
//             <div className="sidebar-panel">
//               <span className="sidebar-title">Interview layout</span>
//               <nav className="sidebar-nav">

//                 <a
//                   href="#technical"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setActive("technical");

//                     const container = mainRef.current;
//                     const element = document.getElementById("technical");

//                     if (container && element) {
//                       container.scrollTo({
//                         top: element.offsetTop,
//                         behavior: "smooth"
//                       });
//                     }
//                   }}
//                   className={active === "technical" ? "active" : ""}
//                 >
//                   Technical questions
//                 </a>

//                 <a
//                   href="#behavioral"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setActive("behavioral");

//                     const container = mainRef.current;
//                     const el = document.getElementById("behavioral");

//                     if (container && el) {
//                       container.scrollTo({
//                         top: el.offsetTop,
//                         behavior: "smooth"
//                       });
//                     }
//                   }}
//                   className={active === "behavioral" ? "active" : ""}
//                 >
//                   Behavioral questions
//                 </a>

//                 <a
//                   href="#roadmap"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setActive("roadmap");

//                     const container = mainRef.current;
//                     const el = document.getElementById("roadmap");

//                     if (container && el) {
//                       container.scrollTo({
//                         top: el.offsetTop,
//                         behavior: "smooth"
//                       });
//                     }
//                   }}
//                   className={active === "roadmap" ? "active" : ""}
//                 >
//                   Road map
//                 </a>
//               </nav>
//             </div>

//             <div className="sidebar-panel">
//               <div className="sidebar-score">
//                 <span>Match score</span>
//                 <div className="circle-score">
//                   <svg width="80" height="80">
//                     <circle
//                       cx="40"
//                       cy="40"
//                       r="34"
//                       stroke="#222"
//                       strokeWidth="6"
//                       fill="none"
//                     />

//                     <circle
//                       cx="40"
//                       cy="40"
//                       r="34"
//                       stroke="url(#gradient)"
//                       strokeWidth="6"
//                       fill="none"
//                       strokeDasharray={2 * Math.PI * 34}
//                       strokeDashoffset={
//                         2 * Math.PI * 34 - (matchScore / 100) * (2 * Math.PI * 34)
//                       }
//                       strokeLinecap="round"
//                     />

//                     <defs>
//                       <linearGradient id="gradient">
//                         <stop offset="0%" stopColor="#ff2c78" />
//                         <stop offset="100%" stopColor="#9d4dff" />
//                       </linearGradient>
//                     </defs>
//                   </svg>

//                   <div className="score-text">{matchScore}%</div>
//                 </div>
//               </div>
//               <p className="sidebar-copy">
//                 This score reflects how well your interview plan aligns with the
//                 role and your current profile.
//               </p>
//               <div className="sidebar-stats">
//                 <div>
//                   <span>{technicalQuestions.length}</span>
//                   <small>Technical</small>
//                 </div>
//                 <div>
//                   <span>{behavioralQuestions.length}</span>
//                   <small>Behavioral</small>
//                 </div>
//               </div>
//             </div>
//           </aside>

//           <main className="detail-main" ref={mainRef}>
//             <div className="detail-header">
//               <div>
//                 <span className="section-pill">Interview strategy</span>
//                 <h1>Review the full preparation layout</h1>
//                 <p>
//                   The plan below includes sample answers, intent guidance, and a
//                   daily study roadmap tailored to your role.
//                 </p>
//               </div>
//               <div className="detail-badge">
//                 <span>Interactive</span>
//               </div>
//             </div>

//             <section className="question-group" id="technical">
//               <div className="group-heading">
//                 <h2>Technical Questions</h2>
//                 <p>{technicalQuestions.length} curated questions with answers.</p>
//               </div>
//               <ul className="question-list">
//                 {[...technicalQuestions]
//                   .sort((a, b) => a.id - b.id)
//                   .map((item, index) => (
//                     <li key={index} className="question-item">
//                       <div className="question-number">Q{index + 1}</div>
//                       <h3>{item.question}</h3>
//                       <p className="question-intent">{item.intention}</p>
//                       <div className="question-answer">
//                         <strong>Suggested answer:</strong>
//                         <p>{item.answer}</p>
//                       </div>
//                     </li>
//                   ))}
//               </ul>
//             </section>

//             <section className="question-group" id="behavioral">
//               <div className="group-heading">
//                 <h2>Behavioral Questions</h2>
//                 <p>{behavioralQuestions.length} practice scenarios for team fit.</p>
//               </div>
//               <ul className="question-list">
//                 {[...behavioralQuestions]
//                   .sort((a, b) => a.id - b.id)
//                   .map((item, index) => (
//                     <li key={index} className="question-item">
//                       <div className="question-number">Q{index + 1}</div>
//                       <h3>{item.question}</h3>
//                       <p className="question-intent">{item.intention}</p>
//                       <div className="question-answer">
//                         <strong>Suggested answer:</strong>
//                         <p>{item.answer}</p>
//                       </div>
//                     </li>
//                   ))}
//               </ul>
//             </section>
//           </main>

//           <aside className="detail-right">
//             <div className="detail-card">
//               <div className="detail-card__header">
//                 <h2>Skill Gaps</h2>
//               </div>
//               <div className="tag-grid">
//                 {skillGaps.length ? (
//                   skillGaps.map((gap, index) => (
//                     <span key={index} className="tag-pill">
//                       {gap}
//                     </span>
//                   ))
//                 ) : (
//                   <p className="empty-state">No specific skill gaps detected.</p>
//                 )}
//               </div>
//             </div>

//             <div className="detail-card" id="roadmap">
//               <div className="detail-card__header">
//                 <h2>Road Map</h2>
//               </div>
//               <ol className="roadmap-list">
//                 {preparationPlan.map((item) => (
//                   <li key={item.day} className="roadmap-item">
//                     <div className="roadmap-title">
//                       <span>Day {item.day}</span>
//                       <strong>{item.focus}</strong>
//                     </div>
//                     <ul>
//                       {item.tasks.map((task, taskIndex) => (
//                         <li key={taskIndex}>{task}</li>
//                       ))}
//                     </ul>
//                   </li>
//                 ))}
//               </ol>
//             </div>
//           </aside>
//         </div>
//       </div>
//     </section >
//   );
// };

// export default Interview;

import React, { useState } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'



const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className={`q-card ${open ? 'open' : ''}`}>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention || "Understand your approach, depth, and communication style."}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer || "Structure your answer with context, implementation details, trade-offs, and a concrete example."}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const { report, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'


    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            const targetId = report?._id || interviewId
                            if (!targetId) {
                                alert("Interview id is missing. Please reload this page.")
                                return
                            }
                            getResumePdf(targetId)
                        }}
                        className='button primary-button' >
                        <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        Download Resume
                    </button>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{report.technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>Strong match for this role</p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview