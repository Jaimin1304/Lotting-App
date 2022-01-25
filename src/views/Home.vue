<template>
  <el-container style="height: 100%">
    <el-header>
      <CommHeader></CommHeader>
    </el-header>
    <el-container>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="6">
            好运人
            <div class="grid-content bg-purple">
              <PersonList></PersonList>
            </div>
          </el-col>
          <el-col :span="7">
            幸运物
            <div class="grid-content bg-purple">
              <GiftList></GiftList>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="2">当前模式: {{getMode}}</el-col>
          <el-col :span="5">当前是否允许一人重复抽中: {{getMultipleHit}}</el-col>
        </el-row>
        <el-row class="mb-4">
          <el-col :span="3">
            <router-link to="/results">
              <el-button type="primary" plain>抽奖结果</el-button>
            </router-link>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" plain @click="dialogVisible = true">规则设定</el-button>
            <el-dialog v-model="dialogVisible" title="规则设定" width="30%">
              <el-form :model="rules">
                <el-form-item label="模式选择">
                  <el-radio-group v-model="rules.mode">
                    <el-radio label="公平模式"></el-radio>
                    <el-radio label="配权模式"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="同一人能否重复抽中">
                  <el-checkbox-group v-model="rules.multipleHit">
                    <el-checkbox label name="type" value="multipleHit"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="dialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="saveAndQuit">保存并退出</el-button>
                </span>
              </template>
            </el-dialog>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" plain @click="lot('抽一人')">抽1人</el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" plain @click="lot('分光幸运物')">分光幸运物</el-button>
          </el-col>

          <!-- conventional dialog for weighted edition -->
          <el-dialog v-model="weightSelectionVisible" title="编辑权重" width="40%" append-to-body>
            <el-table :data="selPersons" style="width: 100%">
              <el-table-column prop="name" label="名字" width="140" />
              <el-table-column prop="remark" label="备注" width="100" />
              <el-table-column prop="weight" label="权重" width="100">
                <template #default="scope">
                  <el-button type="text" size="small" @click="minusWeight(scope.$index)">-</el-button>
                  {{scope.row.weight}}
                  <el-button type="text" size="small" @click="plusWeight(scope.$index)">+</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" @click="handleLotBtn()">开始抽签</el-button>
          </el-dialog>

          <!-- conventional dialog for lotting result -->
          <el-dialog v-model="resultWindowVisible" title="抽签结果" width="40%" append-to-body>
            <el-table :data="currResult" style="width: 100%">
              <el-table-column prop="name" label="幸运儿" width="120" />
              <el-table-column prop="gift" label="幸运物" width="120" />
              <el-table-column prop="type" label="抽签类型" width="100" />
              <el-table-column prop="date" label="时间" width="150" />
            </el-table>
          </el-dialog>

        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import CommHeader from "@/components/CommHeader.vue";
import GiftList from "@/components/GiftList.vue";
import PersonList from "@/components/PersonList.vue";

export default {
  name: "Home",
  components: {
    CommHeader,
    GiftList,
    PersonList
  },
  data() {
    return {
      dialogVisible: false,
      weightSelectionVisible: false,
      resultWindowVisible: false,
      rules: {
        mode: "公平模式",
        multipleHit: []
      },
      selPersons: [],
      selGifts: [],
      currResult: [],
      releaseAllGifts: false
    };
  },
  computed: {
    getMode() {
      return this.$store.state.mode;
    },
    getMultipleHit() {
      return this.$store.state.multipleHit;
    },
    getSelectedPersons() {
      return this.$store.state.selectedPersons;
    },
    getSelectedGifts() {
      return this.$store.state.selectedGifts;
    },
  },
  methods: {
    handleLotBtn() {
      console.log('handleLotBtn')
      if (this.releaseAllGifts) {
        this.processAll('配权模式')
      } else {
        this.processOne('配权模式')
      }
    },
    lot(type) {
      console.log("lot");
      // initialize lotting data
      this.selPersons = this.getSelectedPersons;
      this.selGifts = this.getSelectedGifts;
      // check edge cases
      if (this.selPersons.length === 0 || this.selGifts.length === 0) {
        alert("未选择抽签人或礼品!");
        return;
      }
      // add weight to persons, default is 1
      this.selPersons.forEach(e => e.weight = 1)
      console.log(this.selPersons)
      console.log(this.selGifts)
      // condition branch
      if (this.getMode === "公平模式") {
        console.log("公平模式");
        if (type == '抽一人') {
          this.processOne('公平模式')
        } else {
          this.processAll('公平模式')
        }
      } else if (this.getMode === "配权模式") {
        console.log("配权模式");
        this.releaseAllGifts = (type == '分光幸运物')
        // open weight selection window
        this.weightSelectionVisible = true
      } else {
        console.log("error!");
        alert("error!");
      }
    },
    processOne(mode) {
      console.log("processOne");
      this.weightSelectionVisible = false
      // clear current result
      this.currResult = []
      // choose a winner randomly or by weight
      let winner
      if (mode == '公平模式') {
        winner = this.selPersons[Math.floor(Math.random()*this.selPersons.length)]
      } else if (mode == '配权模式') {
        let weightSum = 0
        this.selPersons.forEach(e => weightSum += e.weight)
        let r = Math.random()*weightSum
        let sum = 0
        for (let e of this.selPersons) {
          sum += e.weight
          if (sum >= r) {
            winner = e
            break
          }
        }
      } else {
        alert('error')
        return
      }
      // remove winner from selected list if multipleHit is false
      // if (!this.getMultipleHit) {
      //   for (let e = 0; e < this.getSelectedPersons.length; e++) {
      //     if (this.getSelectedPersons[e].name == winner.name) {
      //       this.$store.commit('popSelectedPerson', e)
      //     }
      //   }
      // }
      // open result window
      this.resultWindowVisible = true
      // generate records, insert records to results
      let dateNow = new Date(Date.now())
      for (let e of this.selGifts) {
        console.log(e)
        let result = {name: winner.name, gift: e.name, type: '抽一人', date: dateNow.toString()}
        this.$store.commit('appendResult', result)
        this.currResult.push(result)
        // minus gift numbers
        for (let g = this.$store.state.gifts.length-1; g > -1; g--) {
          if (e.name == this.$store.state.gifts[g].name) {
            console.log('match name: ' + e.name)
            this.$store.commit('removeGiftNum', g)
          }
        }
      }
    },
    processAll(mode) {
      console.log("processAll");
      this.weightSelectionVisible = false
      // clear current result
      this.currResult = []
      // calculate the sum of weight
      let weightSum = 0
      this.selPersons.forEach(e => weightSum += e.weight)
      // main loop
      for (let e of this.selGifts) {
        // check if selected persons list is empty
        if (this.selPersons.length == 0) {
          return
        }
        // choose a winner randomly or by weight
        let winner
        if (mode == '公平模式') {
          winner = this.selPersons[Math.floor(Math.random()*this.selPersons.length)]
        } else if (mode == '配权模式') {
          let r = Math.random()*weightSum
          let sum = 0
          for (let i of this.selPersons) {
            sum += i.weight
            if (sum >= r) {
              winner = i
              break
            }
          }
        } else {
          alert('error')
          return
        }
        // remove winner from selected list if multipleHit is false
        if (!this.getMultipleHit) {
          for (let i = this.selPersons.length-1; i > -1; i--) {
            if (this.selPersons[i].name == winner.name) {
              this.selPersons.splice(i, 1)
              break
            }
          }
        }
        // open result window
        this.resultWindowVisible = true
        // generate records, insert records to results
        let dateNow = new Date(Date.now())
        console.log(e)
        let result = {name: winner.name, gift: e.name, type: '分光幸运物', date: dateNow.toString()}
        this.$store.commit('appendResult', result)
        this.currResult.push(result)
        // minus gift numbers
        for (let g = this.$store.state.gifts.length-1; g > -1; g--) {
          if (e.name == this.$store.state.gifts[g].name) {
            console.log('match name: ' + e.name)
            this.$store.commit('removeGiftNum', g)
          }
        }
      }
    },
    saveAndQuit() {
      console.log("saveAndQuit");
      this.dialogVisible = false;
      this.$store.commit("toggleMode", this.rules.mode);
      if (this.rules.multipleHit.length) {
        this.$store.commit("toggleMultipleHit", true);
      } else {
        this.$store.commit("toggleMultipleHit", false);
      }
      console.log(this.$store.state.mode);
      console.log(this.$store.state.multipleHit);
    },
    minusWeight(index) {
      console.log('minus weight')
      if (this.selPersons[index].weight > 1) {
        this.selPersons[index].weight -= 1
      } else {
        alert('权重最低为1')
      }
    },
    plusWeight(index) {
      console.log('plus weight')
      this.selPersons[index].weight += 1
    }
  }
};
</script>

<style>
.el-header {
  background-color: #2f4f4f;
  padding: 0px;
}

.el-main {
  background-color: #e0ffff;
  padding: 0px;
  overflow-x: hidden;
}

</style>
