import Applied from "../models/Applied.js";
import SemesterApplicationDates from "../models/SemesterApplicationDates.js";
import Notification from "../models/Notification.js";

export const checkAndSendNotifications = async (userId) => {
  try {
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    // Get the universities the user has applied to
    const appliedUniversities = await Applied.find({ user: userId }).populate(
      "university"
    );

    for (const applied of appliedUniversities) {
      const semesterDates = await SemesterApplicationDates.findOne({
        university: applied.university._id,
      });

      if (semesterDates) {
        // Check both Fall and Spring semester dates
        const upcomingNotifications = [];

        // Check if application start date is today or upcoming
        if (semesterDates.fallApplicationStartDate >= today) {
          upcomingNotifications.push(
            `Applications for ${
              applied.university.name
            } (Fall) start on ${semesterDates.fallApplicationStartDate.toDateString()}`
          );
        }
        if (semesterDates.springApplicationStartDate >= today) {
          upcomingNotifications.push(
            `Applications for ${
              applied.university.name
            } (Spring) start on ${semesterDates.springApplicationStartDate.toDateString()}`
          );
        }

        // Check if application deadline is approaching
        if (
          semesterDates.fallApplicationEndDate <= sevenDaysLater &&
          semesterDates.fallApplicationEndDate >= today
        ) {
          upcomingNotifications.push(
            `Hurry! Applications for ${
              applied.university.name
            } (Fall) close on ${semesterDates.fallApplicationEndDate.toDateString()}`
          );
        }
        if (
          semesterDates.springApplicationEndDate <= sevenDaysLater &&
          semesterDates.springApplicationEndDate >= today
        ) {
          upcomingNotifications.push(
            `Hurry! Applications for ${
              applied.university.name
            } (Spring) close on ${semesterDates.springApplicationEndDate.toDateString()}`
          );
        }

        // Store notifications in the database
        for (const message of upcomingNotifications) {
          await Notification.create({ user: userId, message });
        }
      }
    }
  } catch (error) {
    console.error("Error checking notifications:", error);
  }
};
