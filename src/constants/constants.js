

export const FLOW_PLANS = {
  "D0155": {title: "D0155 only", files: ["D0155"]},
  "D0148": {title: "D0148 only", files: ["D0148"]},
  "ALL": {title: "All 8 files", files: ["D0155", "D0148", "D0150", "D0149", "D0268", "D0383", "D0384", "D0302"]},
  "SC-1": {title: "Scenario 1 - NHH/AMR", files: ["D0155", "D0148", "D0150", "D0149", "D0302"], 
    defaultValues: {
        retrievalMethod: "R", // AMR
        senderMpid: "BIZZ",
        recipientMpid: "SIEM",
        contractRef: "AMR-CONTRACT"
        }
    },
  "SC-2": {title: "Scenario 2 - NHH/Traditional", files: ["D0155", "D0148", "D0150", "D0149", "D0302"], 
    defaultValues: {
        retrievalMethod: "H", // Traditional
        senderMpid: "FOOO",
        recipientMpid: "SIEM",
        contractRef: "TRAD-CONTRACT"
        }
    },
  "SC-3": {title: "Scenario 3 - HH/HH", files: ["D0155", "D0268", "D0383", "D0384", "D0302"]},
  "SC-4": {title: "Scenario 4 - NHH/Smart", files: ["D0155", "D0148", "D0150", "D0149", "D0302"]},
  "SC-5": {title: "Scenario 5 - NHH/None", files: ["D0155", "D0148", "D0302"]},
  "SC-6": {title: "Scenario 6 - HH/None", files: ["D0155", "D0148", "D0302"]},
  "D0155+D0148": {title: "D0155+D0148 only", files: ["D0155", "D0148"]}
};