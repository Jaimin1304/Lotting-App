<template>
  <el-container style="height: 100%">
    <el-header>
      <CommHeader></CommHeader>
    </el-header>
    <p>抽签结果汇总</p>
    <el-container>
      <el-main>
        <el-row :gutter="20">
          <el-table :data="results" style="width: 100%" id="result_table">
            <el-table-column fixed prop="name" label="幸运儿" width="150" />
            <el-table-column prop="gift" label="幸运物" width="120" />
            <el-table-column prop="type" label="抽签类型" width="120" />
            <el-table-column prop="date" label="时间" width="160" />
          </el-table>
        </el-row>
        <el-row class="mb-4">
          <el-col :span="3">
            <el-button type="primary" plain @click="exportData('xlsx','lotting results')">导出数据</el-button>
          </el-col>
          <el-col :span="3">
            <router-link type="primary" to="/">
              <el-button type="primary" plain>返回抽奖</el-button>
            </router-link>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommHeader from "@/components/CommHeader.vue";
import XLSX from "xlsx";

export default {
  name: "Result",
  components: {
    CommHeader,
    XLSX
  },
  computed: {
    results() {
      return this.$store.state.results;
    }
  },
  methods: {
    exportData(ext, name) {
      console.log("exportData");
      let result_table = document.querySelector("#result_table");
      let wb = XLSX.utils.table_to_book(result_table);
      return XLSX.writeFile(
        wb,
        name + "." + ext || "lotting results." + (ext || "xlsx")
      );
    }
  }
};
</script>

<style>
</style>