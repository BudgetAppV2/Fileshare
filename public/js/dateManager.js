export const dateManager = {
    currentView: "week", // Can be "week" or "month"
    sectionStates: {}, // Stores individual date states for each section

    // Initialize a section with default dates
    initSection(sectionName) {
        if (!this.sectionStates[sectionName]) {
            this.sectionStates[sectionName] = {
                view: "week",
                startDate: this.getStartOfWeek(new Date()),
                endDate: this.getEndOfWeek(new Date())
            };
        }
    },

    // Helper: Get start of the week
    getStartOfWeek(date) {
        let start = new Date(date);
        start.setDate(start.getDate() - start.getDay()); // Go to Sunday
        return start;
    },

    // Helper: Get end of the week
    getEndOfWeek(date) {
        let end = new Date(date);
        end.setDate(end.getDate() - end.getDay() + 6); // End on Saturday
        return end;
    },

    // Helper: Get start of the month
    getStartOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },

    // Helper: Get end of the month
    getEndOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    },

    // Move a section's view to the previous week/month
    prev(sectionName) {
        let section = this.sectionStates[sectionName];
        if (section.view === "week") {
            section.startDate.setDate(section.startDate.getDate() - 7);
            section.endDate.setDate(section.endDate.getDate() - 7);
        } else {
            section.startDate.setMonth(section.startDate.getMonth() - 1);
            section.endDate = this.getEndOfMonth(section.startDate);
        }
        this.notifyUpdate(sectionName);
    },

    // Move a section's view to the next week/month
    next(sectionName) {
        let section = this.sectionStates[sectionName];
        if (section.view === "week") {
            section.startDate.setDate(section.startDate.getDate() + 7);
            section.endDate.setDate(section.endDate.getDate() + 7);
        } else {
            section.startDate.setMonth(section.startDate.getMonth() + 1);
            section.endDate = this.getEndOfMonth(section.startDate);
        }
        this.notifyUpdate(sectionName);
    },

    // Set a section to week view
    setWeekView(sectionName) {
        let section = this.sectionStates[sectionName];
        section.view = "week";
        section.startDate = this.getStartOfWeek(new Date());
        section.endDate = this.getEndOfWeek(new Date());
        this.notifyUpdate(sectionName);
    },

    // Set a section to month view
    setMonthView(sectionName) {
        let section = this.sectionStates[sectionName];
        section.view = "month";
        section.startDate = this.getStartOfMonth(new Date());
        section.endDate = this.getEndOfMonth(new Date());
        this.notifyUpdate(sectionName);
    },

    // Sync all sections to the same view
    syncAll() {
        let refSection = Object.values(this.sectionStates)[0]; // Take the first section as reference
        for (let sectionName in this.sectionStates) {
            this.sectionStates[sectionName].view = refSection.view;
            this.sectionStates[sectionName].startDate = new Date(refSection.startDate);
            this.sectionStates[sectionName].endDate = new Date(refSection.endDate);
            this.notifyUpdate(sectionName);
        }
    },

    // Notify update for a specific section
    notifyUpdate(sectionName) {
        let section = this.sectionStates[sectionName];
        console.log(`📢 ${sectionName.toUpperCase()} Date Range Updated: ${section.startDate.toISOString().split("T")[0]} → ${section.endDate.toISOString().split("T")[0]}`);

        document.dispatchEvent(new CustomEvent("dateRangeUpdated", {
            detail: {
                section: sectionName,
                startDate: section.startDate.toISOString().split("T")[0],
                endDate: section.endDate.toISOString().split("T")[0],
                view: section.view
            }
        }));
    }
};
