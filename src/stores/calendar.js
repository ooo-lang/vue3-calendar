import { defineStore } from "pinia";

export const useStoreCalendar = defineStore('calendar', {
  state: () => ({
    calendarEvents: [
        { id: 1, name: "ミーティング", start: "2023-05-01", end: "2023-05-01", color: "blue" },
        { id: 2, name: "イベント", start: "2023-05-02", end: "2023-05-03", color: "limegreen" },
        { id: 3, name: "会議", start: "2023-05-06", end: "2023-05-06", color: "deepskyblue" },
        { id: 4, name: "有給", start: "2023-05-08", end: "2023-05-08", color: "dimgray" },
        { id: 5, name: "海外旅行", start: "2023-05-08", end: "2023-05-11", color: "navy" },
        { id: 6, name: "誕生日", start: "2023-05-16", end: "2023-05-16", color: "orange" },
        { id: 7, name: "イベント", start: "2023-05-12", end: "2023-05-16", color: "limegreen" },
        { id: 8, name: "出張", start: "2023-05-12", end: "2023-05-13", color: "teal" },
        { id: 9, name: "客先訪問", start: "2023-05-14", end: "2023-05-14", color: "red" },
        { id: 10, name: "パーティ", start: "2023-05-15", end: "2023-05-15", color: "royalblue" },
        { id: 12, name: "ミーティング", start: "2023-05-18", end: "2023-05-19", color: "blue" },
        { id: 13, name: "イベント", start: "2023-05-21", end: "2023-05-21", color: "limegreen" },
        { id: 14, name: "有給", start: "2023-05-20", end: "2023-05-20", color: "dimgray" },
        { id: 15, name: "イベント", start: "2023-05-25", end: "2023-05-28", color: "limegreen" },
        { id: 16, name: "会議", start: "2023-05-21", end: "2023-05-21", color: "deepskyblue" },
        { id: 17, name: "旅行", start: "2023-05-23", end: "2023-05-26", color: "navy" },
        { id: 18, name: "ミーティング", start: "2023-05-28", end: "2023-05-28", color: "blue" },
        { id: 19, name: "会議", start: "2023-05-12", end: "2023-05-12", color: "deepskyblue" },
        { id: 20, name: "誕生日", start: "2023-05-30", end: "2023-05-30", color: "orange" },
      ],
  }),
  // getters: {

  // },
  // actions: {
    
  // }
})