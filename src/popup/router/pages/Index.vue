<template>
  <div>
    <p>{{ $store.getters.foo }}</p>
    <p>{{urlOptionAll}}</p>
    <p>{{weekFromTo.from}} ~ {{weekFromTo.to}}</p>
    
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
const URL = {
  LOGIN_CHECK: 'https://ezkhuman.bizmeka.com/product/golvwkmng/onedaygolvwkmngpers/onedayGolvwkMngPersView.do',
  LIST: 'https://ezkhuman.bizmeka.com/product/golvwkmng/onedaygolvwkmngpers/getOnedayGolvwkMngPersList.do',
  LOGIN: 'https://ezkhuman.bizmeka.com/product/outlnk.do?code=PJ02&',
};

export default {
  data() {
    return {
    };
  },
  computed: {
    foo() {
      return this.$store.getters.foo;
    },
    urlOptionAll() {
      return this.$store.getters.urlOptoin.url;
    },
    weekFromTo() {
      return {
        from: moment().startOf('isoWeek').format('YYYY.MM.DD'),
        to: moment().format('YYYY.MM.DD')
      }
    },
    monthFromTo() {
      // moment.endOf('month').format(dateFormat);
      return {
        from: moment().startOf('month').format('YYYY.MM.DD'),
        to: moment().format('YYYY.MM.DD')
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      axios.get(URL.LOGIN_CHECK)
        .then(({data}) => {
          if(data.indexOf('Since your browser does not support JavaScript') !== -1) {
            window.open(URL.LOGIN, 'ESC');
          } else {
            this.setUserInfo(data);
          }
        })
        .then(() => {
          this.getWeek();
          this.getMonth();
          this.getMonthTest();
        })
        .catch(res => {
          window.open(URL.LOGIN, 'ESC');
        });
    },
    setUserInfo(payload) {
      const domparser = new DOMParser();
      const doc = domparser.parseFromString(payload, 'text/html');
      const entryDt = doc.querySelector('#entryDt').value;
      const emplNo =  doc.querySelector('#onedayGolvwkMngPersGridSearchForm [name="emplNo"]').value;
      const enplcCd = doc.querySelector('#enplcCd').value;
      const url = `${this.$store.getters.urlOptoin.base}&entryDt=${entryDt}&emplNo=${emplNo}`
      this.$store.dispatch('setFoo', 'update foo bar');
      this.$store.dispatch('setUrlOption', {entryDt, emplNo, enplcCd, url});
    },
    getData({from, to}) {
      return `${this.$store.getters.urlOptoin.url}&workDate=${from}&workDateTo=${to}`
    },
    getWeek() {
      axios.post(URL.LIST, this.getData(this.weekFromTo))
        .then(({data}) => {
          console.log(data.result, data.result.recordCount);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMonth() {
      axios.post(URL.LIST, this.getData(this.monthFromTo))
        .then(({data}) => {
          console.log(data.result, data.result.recordCount);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMonthTest() {
      axios.post(URL.LIST, this.getData({ from:'2021.12.01', to:'2021.12.31'}))
        .then(({data}) => {
          console.log(data.result, data.result.recordCount);
          
          // 주말 근무 찾기
          let weekend = data.result.entity.filter(item => {
            const isoWeekday = moment(item.workDate,'YYYY.MM.DD').isoWeekday();
            return isoWeekday === 6 || isoWeekday === 7;
          });
          console.log(weekend);
          
          // 주말 근무 시간 계산하기
          weekend =  this.weekendWorkTime(weekend);
          console.log(weekend);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    strTimeDiff(from, to) {
      const d = moment.duration(moment(to,'YYYY.MM.DD HH:mm').diff(moment(from,'YYYY.MM.DD HH:mm')));
      return `${String(d.hours()).padStart(2,'0')}:${String(d.minutes()).padStart(2,'0')}`;
    },
    weekendWorkTime(data) {
      data.forEach((item) => {
        item.workHour = this.strTimeDiff(`${item.workDate} ${item.workTimeFrom}`, `${item.workDate} ${item.workTimeTo}`);
      });
      return data;
    }
  }
};
</script>

<style lang="less">
@import 'src/less/popup';

p{ .fs(20); }
</style>
