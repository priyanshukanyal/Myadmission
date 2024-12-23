import mongoose from "mongoose";
import XLSX from "xlsx";
import fs from "fs";
import University from "../models/universityModel.js";

// Function to convert string to camelCase
const toCamelCase = (str) => {
  return str
    .replace(/[_/]+(.)/g, (match, letter) => letter.toUpperCase()) // Remove _ and / and convert to uppercase
    .replace(/^([A-Z])/, (match, letter) => letter.toLowerCase()); // Ensure the first letter is lowercase
};

// Function to clean and parse the data before inserting into the database
const cleanNumber = (value) => {
  if (typeof value === "string") {
    value = value.replace(/[^0-9.-]+/g, ""); // Remove non-numeric characters
  }
  return parseFloat(value) || null;
};

// Function to read Excel file and insert data into MongoDB
const importExcelData = async (filePath) => {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
    const worksheet = workbook.Sheets[sheetName];

    // Convert the Excel sheet to JSON format
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Extract column headers from the first row
    const headers = data[0].map((header) => toCamelCase(header));

    // Log all headers in a readable format
    console.log("Headers extracted:");
    headers.forEach((header, index) => {
      console.log(`${index + 1}. ${header}`);
    });

    // Loop through the rows starting from the second row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const universityData = { specialCourses: [] };

      // Skip row if University Name is missing
      if (!row[headers.indexOf("universityName")]) continue;

      // Mapping each column to the corresponding field in the model
      headers.forEach((header, index) => {
        let value = row[index];

        // For boolean columns (e.g., financialAid, pellGrant, studentLoans)
        if (["financialAid", "pellGrant", "studentLoans"].includes(header)) {
          value = value === "YES" || value === "yes" ? true : false;
        }

        // For special courses (e.g., accounting, aerospaceEngineering, etc.)
        if (
          value === "YES" ||
          value === "yes" ||
          header.startsWith("specialCourse")
        ) {
          universityData.specialCourses.push(header);
        }

        // Handle nested objects (e.g., SAT and ACT scores)
        if (header.startsWith("sat")) {
          if (!universityData.sat) universityData.sat = {};
          const key = header.replace("sat", "").toLowerCase();
          universityData.sat[key] = cleanNumber(value);
        } else if (header.startsWith("act")) {
          if (!universityData.act) universityData.act = {};
          const key = header.replace("act", "").toLowerCase();
          universityData.act[key] = cleanNumber(value);
        } else if (header === "courses") {
          // Convert courses column to an array
          universityData.courses = value
            ? value.split(",").map((course) => course.trim())
            : [];
        } else {
          // Clean and store numeric data or leave it as is for non-numeric data
          universityData[header] = cleanNumber(value) || value;
        }
      });

      // Insert the data into MongoDB
      try {
        const university = new University(universityData);
        await university.save();
        console.log(
          `Successfully added university: ${university.universityName}`
        );
      } catch (err) {
        console.error(
          `Error saving university: ${universityData.universityName}`,
          err
        );
      }
    }
  } catch (err) {
    console.error("Error importing Excel data:", err);
  }
};

// MongoDB connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://kanyalpriyanshu:5uGysGZy9J9pwaRs@cluster0.zbshd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

// Run the script
const runScript = async () => {
  try {
    await connectToDatabase();
    await importExcelData("./data/university_data_v12.xlsx"); // Specify your Excel file path here
  } catch (err) {
    console.error("Error in script execution:", err);
  }
};

runScript();

// import mongoose from "mongoose";
// import XLSX from "xlsx";
// import fs from "fs";
// import University from "../models/universityModel.js";

// // Function to convert string to camelCase
// const toCamelCase = (str) => {
//   return str
//     .replace(/[_/]+(.)/g, (match, letter) => letter.toUpperCase()) // Remove _ and / and convert to uppercase
//     .replace(/^([A-Z])/, (match, letter) => letter.toLowerCase()); // Ensure first letter is lowercase
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
//     const headers = data[0];

//     // Log all headers in a readable format
//     console.log("Headers extracted:");
//     headers.forEach((header, index) => {
//       console.log(`${index + 1}. ${header}`);
//     });

//     // Optionally save headers to a file
//     fs.writeFileSync("headers.txt", headers.join("\n"), "utf-8");
//     console.log("Headers saved to headers.txt");

//     // Loop through the rows starting from the second row
//     for (let i = 1; i < data.length; i++) {
//       const row = data[i];
//       const universityData = { specialCourses: [] };

//       // Skip row if University Name is missing
//       if (!row[headers.indexOf("University_Name")]) continue;

//       // Mapping each column to the corresponding field in the model
//       for (let j = 0; j < headers.length; j++) {
//         const column = headers[j];
//         let value = row[j];

//         // Convert the column name to camelCase
//         const camelCasedColumn = toCamelCase(column);

//         // For boolean columns (e.g. Financial Aid, Pell Grant, Student Loans)
//         if (
//           camelCasedColumn === "financialAid" ||
//           camelCasedColumn === "pellGrant" ||
//           camelCasedColumn === "studentLoans"
//         ) {
//           value = value === "YES" || value === "yes" ? true : false;
//         }

//         // For special courses (e.g. accounting, aerospaceEngineering, etc.)
//         if (value === "YES" || value === "yes") {
//           universityData.specialCourses.push(camelCasedColumn);
//         }

//         // Mapping nested objects (e.g. SAT and ACT scores)
//         if (camelCasedColumn.startsWith("sat")) {
//           if (!universityData.sat) universityData.sat = {};
//           universityData.sat[camelCasedColumn.split("_")[1]] =
//             cleanNumber(value);
//         } else if (camelCasedColumn.startsWith("act")) {
//           if (!universityData.act) universityData.act = {};
//           universityData.act[camelCasedColumn.split("_")[1]] =
//             cleanNumber(value);
//         } else if (camelCasedColumn === "courses") {
//           // Convert courses column to an array
//           universityData.courses = value
//             ? value.split(",").map((course) => course.trim())
//             : [];
//         } else {
//           // Clean and store numeric data or leave it as is for non-numeric data
//           universityData[camelCasedColumn] = cleanNumber(value) || value;
//         }
//       }

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
