import mongoose from "mongoose";
import XLSX from "xlsx";

// Convert string to camelCase
const toCamelCase = (str) => {
  return str
    .replace(/[_/]+(.)/g, (match, letter) => letter.toUpperCase())
    .replace(/^([A-Z])/, (match, letter) => letter.toLowerCase());
};

// Clean and parse the data to a valid number
const cleanNumber = (value) => {
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    value = value.replace(/[^0-9.-]+/g, "");
  }
  return isNaN(parseFloat(value)) ? null : parseFloat(value);
};

// Define the schema dynamically based on headers
const createDynamicSchema = (headers) => {
  const schemaDefinition = {};

  headers.forEach((header) => {
    if (header === "specialCourses") {
      schemaDefinition[header] = { type: [String], default: [] };
    } else if (header === "admissionsPhone") {
      schemaDefinition[header] = { type: String, trim: true, default: null };
    } else if (header === "emailAddress") {
      schemaDefinition[header] = {
        type: String,
        trim: true,
        lowercase: true,
        default: null,
      };
    } else {
      schemaDefinition[header] = {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      };
    }
  });

  return new mongoose.Schema(schemaDefinition, { timestamps: true });
};

// Read Excel data and insert into MongoDB
const importExcelData = async (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = data[0].map((header) => toCamelCase(header));
    console.log("Headers extracted:", headers);

    const UniversitySchema = createDynamicSchema(headers);
    const University = mongoose.model("University", UniversitySchema);

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const universityData = { specialCourses: [] };

      // Skip rows without a university name
      if (!row[headers.indexOf("universityName")]) continue;

      headers.forEach((header, index) => {
        const value = row[index];

        if (header === "admissionsPhone") {
          universityData[header] =
            value && /^[0-9()-\s]+$/.test(value.trim()) ? value.trim() : null;
        } else if (header === "emailAddress") {
          universityData[header] =
            value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
              ? value.trim().toLowerCase()
              : null;
        } else if (value === "YES" || value === "yes") {
          universityData.specialCourses.push(header);
        } else {
          universityData[header] = cleanNumber(value) || value;
        }
      });

      // Validate and save the university data
      try {
        const university = new University(universityData);
        await university.save();
        console.log(`Successfully added: ${university.universityName}`);
      } catch (err) {
        console.error(
          `Error saving university: ${
            universityData.universityName || "Unknown"
          }`,
          err.message
        );
      }
    }
  } catch (err) {
    console.error("Error importing Excel data:", err.message);
  }
};

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://kanyalpriyanshu:5uGysGZy9J9pwaRs@cluster0.zbshd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

// Run the script
const runScript = async () => {
  try {
    await connectToDatabase();
    await importExcelData("./data/university_data_v12.xlsx");
  } catch (err) {
    console.error("Error in script execution:", err.message);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

runScript();

// import mongoose from "mongoose";
// import XLSX from "xlsx";
// import University from "../models/universityModel.js";

// // Convert string to camelCase
// const toCamelCase = (str) => {
//   return str
//     .replace(/[_/]+(.)/g, (match, letter) => letter.toUpperCase())
//     .replace(/^([A-Z])/, (match, letter) => letter.toLowerCase());
// };

// // Clean and parse the data to a valid number
// const cleanNumber = (value) => {
//   if (value == null || value === "") return null;
//   if (typeof value === "string") {
//     value = value.replace(/[^0-9.-]+/g, "");
//   }
//   return isNaN(parseFloat(value)) ? null : parseFloat(value);
// };

// // Read Excel data and insert into MongoDB
// const importExcelData = async (filePath) => {
//   try {
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//     const headers = data[0].map((header) => toCamelCase(header));
//     console.log("Headers extracted:", headers);

//     for (let i = 1; i < data.length; i++) {
//       const row = data[i];
//       const universityData = { specialCourses: [] };

//       // Skip rows without a university name
//       if (!row[headers.indexOf("universityName")]) continue;

//       headers.forEach((header, index) => {
//         const value = row[index];

//         if (header === "admissionsPhone") {
//           universityData.phone =
//             value && /^[0-9()-\s]+$/.test(value.trim()) ? value.trim() : null;
//         } else if (header === "emailAddress") {
//           universityData.email =
//             value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
//               ? value.trim().toLowerCase()
//               : null;
//         } else if (value === "YES" || value === "yes") {
//           universityData.specialCourses.push(header);
//         } else {
//           // Default handling for numeric or string fields
//           universityData[header] = cleanNumber(value) || value;
//         }
//       });

//       // Validate and save the university data
//       try {
//         const university = new University(universityData);
//         await university.save();
//         console.log(`Successfully added: ${university.universityName}`);
//       } catch (err) {
//         console.error(
//           `Error saving university: ${
//             universityData.universityName || "Unknown"
//           }`,
//           err.message
//         );
//       }
//     }
//   } catch (err) {
//     console.error("Error importing Excel data:", err.message);
//   }
// };

// // Connect to MongoDB
// const connectToDatabase = async () => {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://kanyalpriyanshu:5uGysGZy9J9pwaRs@cluster0.zbshd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
//       { useNewUrlParser: true, useUnifiedTopology: true }
//     );
//     console.log("Connected to MongoDB!");
//   } catch (err) {
//     console.error("MongoDB connection error:", err.message);
//   }
// };

// // Run the script
// const runScript = async () => {
//   try {
//     await connectToDatabase();
//     await importExcelData("./data/university_data_v12.xlsx");
//   } catch (err) {
//     console.error("Error in script execution:", err.message);
//   } finally {
//     mongoose.connection.close();
//     console.log("Database connection closed.");
//   }
// };

// runScript();

// import mongoose from "mongoose";
// import XLSX from "xlsx";
// import University from "../models/universityModel.js";

// // Convert string to camelCase
// const toCamelCase = (str) => {
//   return str
//     .replace(/[_/]+(.)/g, (match, letter) => letter.toUpperCase())
//     .replace(/^([A-Z])/, (match, letter) => letter.toLowerCase());
// };
// // Clean and parse the data
// const cleanNumber = (value) => {
//   if (value == null || value === "") return null;
//   if (typeof value === "string") {
//     value = value.replace(/[^0-9.-]+/g, "");
//   }
//   return isNaN(parseFloat(value)) ? null : parseFloat(value);
// };
// // Read Excel data and insert into MongoDB
// const importExcelData = async (filePath) => {
//   try {
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//     const headers = data[0].map((header) => toCamelCase(header));

//     console.log("Headers extracted:", headers);

//     for (let i = 1; i < data.length; i++) {
//       const row = data[i];
//       const universityData = { specialCourses: [] };

//       // Skip rows without a university name
//       if (!row[headers.indexOf("universityName")]) continue;

//       headers.forEach((header, index) => {
//         const value = row[index];

//         // // Handle SAT and ACT fields
//         // if (
//         //   ["satErwMin", "satErwMax", "satMathMin", "satMathMax"].includes(
//         //     header
//         //   )
//         // ) {
//         //   universityData[header] = cleanNumber(value);
//         // } else if (["actMin", "actMax"].includes(header)) {
//         //   universityData[header] = cleanNumber(value);
//         // }
//         // Handle phone numbers
//         if (header === "admissionsPhone") {
//           universityData.phone =
//             value && /^[0-9()-\s]+$/.test(value.trim()) ? value.trim() : null;
//         }
//         // Handle emails
//         else if (header === "emailAddress") {
//           universityData.email =
//             value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
//               ? value.trim().toLowerCase()
//               : null;
//         }
//         // Handle "YES" values for special courses
//         else if (value === "YES" || value === "yes") {
//           universityData.specialCourses.push(header);
//         }
//         // Default handling for other fields
//         else {
//           universityData[header] = cleanNumber(value) || value;
//         }
//       });

//       // Validate and save the university data
//       try {
//         const university = new University(universityData);
//         await university.save();
//         // console.log(
//         //   `Successfully added university: ${university.universityName}`
//         // );
//       } catch (err) {
//         console.error(`Error saving university:`, universityData, err.message);
//       }
//     }
//   } catch (err) {
//     console.error("Error importing Excel data:", err.message);
//   }
// };

// // Connect to MongoDB
// const connectToDatabase = async () => {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://kanyalpriyanshu:5uGysGZy9J9pwaRs@cluster0.zbshd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//     );
//     // console.log("Connected to MongoDB!");
//   } catch (err) {
//     console.error("MongoDB connection error:", err.message);
//   }
// };

// // Run the script
// const runScript = async () => {
//   try {
//     await connectToDatabase();
//     await importExcelData("./data/university_data_v12.xlsx");
//   } catch (err) {
//     console.error("Error in script execution:", err.message);
//   }
// };

// runScript();

// import mongoose from "mongoose";
// import XLSX from "xlsx";
// import University from "../models/universityModel.js";

// // Convert string to camelCase
// const toCamelCase = (str) => {
//   return str
//     .replace(/[_/]+(.)/g, (match, letter) => letter.toUpperCase())
//     .replace(/^([A-Z])/, (match, letter) => letter.toLowerCase());
// };

// // Clean and parse the data
// const cleanNumber = (value) => {
//   if (value == null || value === "") return null;
//   if (typeof value === "string") {
//     value = value.replace(/[^0-9.-]+/g, "");
//   }
//   return isNaN(parseFloat(value)) ? null : parseFloat(value);
// };

// // Read Excel data and insert into MongoDB
// const importExcelData = async (filePath) => {
//   try {
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//     const headers = data[0].map((header) => toCamelCase(header));

//     console.log("Headers extracted:", headers);

//     for (let i = 1; i < data.length; i++) {
//       const row = data[i];
//       const universityData = { specialCourses: [] };

//       // Skip rows without a university name
//       if (!row[headers.indexOf("universityName")]) continue;

//       headers.forEach((header, index) => {
//         const value = row[index];

//         // Handle SAT fields
//         if (header.startsWith("sat")) {
//           if (!universityData.sat) universityData.sat = {};
//           const key = header.replace("sat", "");
//           universityData.sat[toCamelCase(key)] = cleanNumber(value);
//         }
//         // Handle ACT fields
//         else if (header.startsWith("act")) {
//           if (!universityData.act) universityData.act = {};
//           const key = header.replace("act", "");
//           universityData.act[toCamelCase(key)] = cleanNumber(value);
//         }
//         // Handle phone numbers
//         else if (header === "admissionsPhone") {
//           universityData.phone =
//             value && /^[0-9()-\s]+$/.test(value.trim()) ? value.trim() : null;
//         }
//         // Handle emails
//         else if (header === "emailAddress") {
//           universityData.email =
//             value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
//               ? value.trim().toLowerCase()
//               : null;
//         }
//         // Handle "YES" values for special courses
//         else if (value === "YES" || value === "yes") {
//           universityData.specialCourses.push(header);
//         }
//         // Default handling for other fields
//         else {
//           universityData[header] = cleanNumber(value) || value;
//         }
//       });

//       // Validate and save the university data
//       try {
//         const university = new University(universityData);
//         await university.save();
//         console.log(
//           `Successfully added university: ${university.universityName}`
//         );
//       } catch (err) {
//         console.error(`Error saving university:`, universityData, err.message);
//       }
//     }
//   } catch (err) {
//     console.error("Error importing Excel data:", err.message);
//   }
// };

// // Connect to MongoDB
// const connectToDatabase = async () => {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://kanyalpriyanshu:5uGysGZy9J9pwaRs@cluster0.zbshd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//     );
//     console.log("Connected to MongoDB!");
//   } catch (err) {
//     console.error("MongoDB connection error:", err.message);
//   }
// };

// // Run the script
// const runScript = async () => {
//   try {
//     await connectToDatabase();
//     await importExcelData("./data/university_data_v12.xlsx");
//   } catch (err) {
//     console.error("Error in script execution:", err.message);
//   }
// };

// runScript();

// import mongoose from "mongoose";
// import XLSX from "xlsx";
// import University from "../models/universityModel.js";

// // Function to convert string to camelCase
// const toCamelCase = (str) => {
//   return str
//     .replace(/[_/]+(.)/g, (match, letter) => letter.toUpperCase())
//     .replace(/^([A-Z])/, (match, letter) => letter.toLowerCase());
// };

// // Function to clean and parse the data before inserting into the database
// const cleanNumber = (value) => {
//   if (typeof value === "string") {
//     value = value.replace(/[^0-9.-]+/g, "");
//   }
//   return parseFloat(value) || null;
// };

// // Function to read Excel file and insert data into MongoDB
// const importExcelData = async (filePath) => {
//   try {
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//     const headers = data[0].map((header) => toCamelCase(header));

//     console.log("Headers extracted:");
//     headers.forEach((header, index) => {
//       console.log(`${index + 1}. ${header}`);
//     });

//     for (let i = 1; i < data.length; i++) {
//       const row = data[i];
//       const universityData = { specialCourses: [] };

//       if (!row[headers.indexOf("universityName")]) continue;

//       headers.forEach((header, index) => {
//         let value = row[index];

//         if (header.match(/^sat_/i)) {
//           if (!universityData.sat) universityData.sat = {};
//           const key = header.replace(/^sat_/i, "").toLowerCase();
//           universityData.sat[toCamelCase(key)] = cleanNumber(value);
//         } else if (header.match(/^act_/i)) {
//           if (!universityData.act) universityData.act = {};
//           const key = header.replace(/^act_/i, "").toLowerCase();
//           universityData.act[toCamelCase(key)] = cleanNumber(value);
//         } else if (header === "admissionsPhone") {
//           universityData.phone =
//             value && /^[0-9()-\s]+$/.test(value.trim()) ? value.trim() : null;
//         } else if (header === "emailAddress") {
//           universityData.email =
//             value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
//               ? value.trim().toLowerCase()
//               : null;
//         } else if (value === "YES" || value === "yes") {
//           if (
//             header.startsWith("specialCourse") ||
//             ["accounting", "aerospaceEngineering"].includes(header)
//           ) {
//             universityData.specialCourses.push(header);
//           }
//         } else {
//           universityData[header] = cleanNumber(value) || value;
//         }
//       });

//       try {
//         const university = new University(universityData);
//         await university.save();
//         console.log(
//           `Successfully added university: ${university.universityName}`
//         );
//       } catch (err) {
//         console.error(
//           `Error saving university: ${universityData.universityName}`,
//           err
//         );
//       }
//     }
//   } catch (err) {
//     console.error("Error importing Excel data:", err);
//   }
// };

// const connectToDatabase = async () => {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://kanyalpriyanshu:5uGysGZy9J9pwaRs@cluster0.zbshd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//     );
//     console.log("Connected to MongoDB!");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//   }
// };

// const runScript = async () => {
//   try {
//     await connectToDatabase();
//     await importExcelData("./data/university_data_v12.xlsx");
//   } catch (err) {
//     console.error("Error in script execution:", err);
//   }
// };

// runScript();

// import mongoose from "mongoose";
// import XLSX from "xlsx";
// import fs from "fs";
// import University from "../models/universityModel.js";

// // Function to convert string to camelCase
// const toCamelCase = (str) => {
//   return str
//     .replace(/[_/]+(.)/g, (match, letter) => letter.toUpperCase()) // Remove _ and / and convert to uppercase
//     .replace(/^([A-Z])/, (match, letter) => letter.toLowerCase()); // Ensure the first letter is lowercase
// };

// // Function to clean and parse the data before inserting into the database
// const cleanNumber = (value) => {
//   if (typeof value === "string") {
//     value = value.replace(/[^0-9.-]+/g, ""); // Remove non-numeric characters
//   }
//   return parseFloat(value) || null;
// };

// // Function to read Excel file and insert data into MongoDB
// const importExcelData = async (filePath) => {
//   try {
//     // Read the Excel file
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
//     const worksheet = workbook.Sheets[sheetName];

//     // Convert the Excel sheet to JSON format
//     const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//     // Extract column headers from the first row
//     const headers = data[0].map((header) => toCamelCase(header));

//     // Log all headers in a readable format
//     console.log("Headers extracted:");
//     headers.forEach((header, index) => {
//       console.log(`${index + 1}. ${header}`);
//     });

//     // Loop through the rows starting from the second row
//     for (let i = 1; i < data.length; i++) {
//       const row = data[i];
//       const universityData = { specialCourses: [] };

//       // Skip row if University Name is missing
//       if (!row[headers.indexOf("universityName")]) continue;

//       // Mapping each column to the corresponding field in the model
//       headers.forEach((header, index) => {
//         let value = row[index];

//         // For special courses (e.g., accounting, aerospaceEngineering, etc.)
//         if (
//           value === "YES" ||
//           value === "yes" ||
//           header.startsWith("specialCourse")
//         ) {
//           universityData.specialCourses.push(header);
//         }

//         // Handle nested objects (e.g., SAT and ACT scores)
//         if (header.startsWith("sat")) {
//           if (!universityData.sat) universityData.sat = {};
//           const key = header.replace("sat", "").toLowerCase();
//           universityData.sat[key] = cleanNumber(value);
//         } else if (header.startsWith("act")) {
//           if (!universityData.act) universityData.act = {};
//           const key = header.replace("act", "").toLowerCase();
//           universityData.act[key] = cleanNumber(value);
//         } else if (header === "courses") {
//           // Convert courses column to an array
//           universityData.courses = value
//             ? value.split(",").map((course) => course.trim())
//             : [];
//         } else {
//           // Clean and store numeric data or leave it as is for non-numeric data
//           universityData[header] = cleanNumber(value) || value;
//         }
//       });

//       // Insert the data into MongoDB
//       try {
//         const university = new University(universityData);
//         await university.save();
//         console.log(
//           `Successfully added university: ${university.universityName}`
//         );
//       } catch (err) {
//         console.error(
//           `Error saving university: ${universityData.universityName}`,
//           err
//         );
//       }
//     }
//   } catch (err) {
//     console.error("Error importing Excel data:", err);
//   }
// };

// // MongoDB connection
// const connectToDatabase = async () => {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://kanyalpriyanshu:5uGysGZy9J9pwaRs@cluster0.zbshd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//     );
//     console.log("Connected to MongoDB!");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//   }
// };

// // Run the script
// const runScript = async () => {
//   try {
//     await connectToDatabase();
//     await importExcelData("./data/university_data_v12.xlsx"); // Specify your Excel file path here
//   } catch (err) {
//     console.error("Error in script execution:", err);
//   }
// };

// runScript();
