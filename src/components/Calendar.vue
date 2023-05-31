<template>
  <div class="content">
    <h2>カレンダー{{ displayMonth }}</h2>
    <div class="button-area">
      <button class="button" @click="prevMonth">前の月</button>
      <button class="button" @click="nextMonth">次の月</button>
    </div>
    <div 
      class="calendar"
    >
    <div class="calendar-weekly">
      <div class="calendar-youbi" v-for="n in 7" :key="n">
        {{ youbi(n - 1) }}
      </div>
    </div>
      <div 
        v-for="(week, index) in calendars" 
        :key="index" 
        class="calendar-weekly"
      >
        <div 
          v-for="(day, index) in week" :key="index" 
          class="calendar-daily"
          :class="{ outside: currentMonth !== day.month }"
        >
          <div class="calendar-day">
            {{ day.date }}
          </div>
          <div v-for="dayEvent in day.dayEvents" :key="dayEvent.id">
            <RouterLink
              :to="`/calendar/${dayEvent.id}`" 
            >
              <div
                v-if="dayEvent.width"
                class="calendar-event"
                :style="`width:${dayEvent.width}%;background-color:${dayEvent.color}`"
                draggable="true"
              >
                {{ dayEvent.name }}
              </div>
              <div v-else style="height: 26px;"></div>
            </RouterLink>
          </div>
        </div>
      </div>  
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { useStoreCalendar } from "../stores/calendar";
import { mapState } from 'pinia';

export default {
  name: 'CalendarComp',
  data() {
    return {
      currentDate: moment(),
      // events: this.calendarEvents,
    };
  },
  computed: {
    ...mapState(useStoreCalendar, ['calendarEvents']),
    calendars() {
      return this.getCalendar();
    },
    displayMonth() {
      return this.currentDate.format('YYYY[年]M[月]')
    },
    currentMonth() {
      return this.currentDate.format('YYYY-MM')
    }
  },
  methods: {
    getStartDate() {
      let date = moment(this.currentDate);
      date.startOf("month");
      const youbiNum = date.day();
      return date.subtract(youbiNum, "days");
    },
    getEndDate() {
      let date = moment(this.currentDate);
      date.endOf("month");
      const youbiNum = date.day();
      return date.add(6 - youbiNum, "days");
    },
    getCalendar() {
      let calendarDate = this.getStartDate();
      const endDate = this.getEndDate();
      const weekNumber = Math.ceil(endDate.diff(calendarDate, "days") / 7);
      let calendars = [];
      for (let week = 0; week < weekNumber; week++) {
        let weekRow = [];
        for (let day = 0; day < 7; day++) {
          // ↓↓↓その月のイベントをDBから取ってきてListからfindしていく方法がいいかも
          let dayEvents = this.getDayEvents(calendarDate, day)
          weekRow.push({
            date: calendarDate.get("date"),
            month: calendarDate.format("YYYY-MM"),
            dayEvents
          });
          calendarDate.add(1, "days");
        }
        calendars.push(weekRow);
      }
      return calendars;
    },
    nextMonth() {
      this.currentDate = moment(this.currentDate).add(1, "month");
    },
    prevMonth() {
      this.currentDate = moment(this.currentDate).subtract(1, "month");
    },
    youbi(dayIndex) {
      // 環境変数から日本語の曜日verと英語の曜日verを設定ごとに取得するといいかも
      const week = ["日", "月", "火", "水", "木", "金", "土"];
      return week[dayIndex];
    },
    getDayEvents(date, day) {
      let stackIndex = 0;
      let dayEvents = [];
      let startedEvents = [];
      this.sortedEvents().forEach(event => {
        let startDate = moment(event.start).format('YYYY-MM-DD')
        let endDate = moment(event.end).format('YYYY-MM-DD')
        let Date = date.format('YYYY-MM-DD')
        if (startDate <= Date && endDate >= Date) {
          if (startDate === Date) {
            // let betweenDays = moment(endDate).diff(moment(startDate), "days")
            // let width = betweenDays * 100 + 95;
            // let width = this.getEventWidth(endDate, startDate, day)
            // console.log(event, width)
            [stackIndex, dayEvents] = this.getStackEvents(
              event,
              day,              
              stackIndex,
              dayEvents,
              startedEvents,
              event.start
            );
            // dayEvents.push({...event,width})
          } else if (day === 0) {
            // let width = this.getEventWidth(date, endDate, day)
            // dayEvents.push({...event,width})
            [stackIndex, dayEvents] = this.getStackEvents(
              event,
              day,
              stackIndex,
              dayEvents,
              startedEvents,
              Date
            );
          } else {
            startedEvents.push(event)
          }
        }
      });
      return dayEvents;
    },
    getEventWidth(start, end, day) {
      let betweenDays = moment(end).diff(moment(start), "days")
      if (betweenDays > 6 - day) {
        return (6 - day) * 100 + 95;
      } else {
        return betweenDays * 100 + 95;
      }
    },
    // DB側で行う場合はこの処理は必要ない
    sortedEvents() {
      return this.calendarEvents.slice().sort(function (a, b) {
        let startDate = moment(a.start).format('YYYY-MM-DD')
        let startDate_2 = moment(b.start).format('YYYY-MM-DD')
        if (startDate < startDate_2) return -1;
        if (startDate > startDate_2) return 1;
        return 0;
      })
    },
    getStackEvents(event, day, stackIndex, dayEvents, startedEvents, start) {
      [stackIndex, dayEvents] = this.getStartedEvents(
        stackIndex, startedEvents, dayEvents
      )
      let width = this.getEventWidth(start, event.end, day)
      Object.assign(event, {
        stackIndex
      })
      dayEvents.push({ ...event, width })
      stackIndex++;
      return [stackIndex, dayEvents];
    },
    getStartedEvents(stackIndex, startedEvents, dayEvents) {
      let startedEvent;
      do {
        startedEvent = startedEvents
          .find(event => event.stackIndex === stackIndex)
        if (startedEvent) {
          console.log(startedEvent)
          dayEvents.push(startedEvent)
          stackIndex++;
        }
      } while (typeof startedEvent !== 'undefined')
      console.log([stackIndex, dayEvents])
      return [stackIndex, dayEvents]
    }
  },
  
}
</script>
<style scoped>
.content{
  margin:2em auto;
  width:900px;
}
.button-area{
  margin:0.5em 0;
}
.button{
  padding:4px 8px;
  margin-right:8px;
}
.calendar{
  max-width:900px;
  border-top:1px solid #E0E0E0;
  font-size:0.8em;
}
.calendar-weekly{
  display:flex;
  border-left:1px solid #E0E0E0;
  /* background-color: black; */
}
.calendar-daily{
  flex:1;
  min-height:125px;
  border-right:1px solid #E0E0E0;
  border-bottom:1px solid #E0E0E0;
  margin-right:-1px;
}
.calendar-day{
  text-align: center;
}
.calendar-youbi{
  flex:1;
  border-right:1px solid #E0E0E0;
  margin-right:-1px;
  text-align:center;
}
.outside{
  background-color: #f7f7f7;
}
.calendar-event{
  color:white;
  margin-bottom:1px;
  height:25px;
  line-height:25px;
}
.calendar-event{
  color:white;
  margin-bottom:1px;
  height:25px;
  line-height:25px;
  position: relative;
  z-index:1;
  border-radius:4px;
  padding-left:4px;
}
</style>