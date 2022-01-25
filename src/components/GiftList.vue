<template>
  <div>
    <el-container>
      <el-main>
        <el-row :gutter="20">
          <el-table :data="gifts" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60" />
            <el-table-column prop="name" label="名字" width="140" />
            <el-table-column prop="remark" label="备注" width="100" />
            <el-table-column prop="num" label="份额" width="100">
              <template #default="scope">
                <el-button type="text" size="small" @click="minusGift(scope.$index)">-</el-button>
                {{scope.row.num}}
                <el-button type="text" size="small" @click="plusGift(scope.$index)">+</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="openEditDialog(scope.$index, scope.row.name, scope.row.remark)"
                >编辑</el-button>
                <el-button type="text" size="small" @click="deleteGift(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>

        <!-- conventional dialog for edition -->
        <el-dialog v-model="editVisible" title="编辑" width="30%" append-to-body>
          <span>现名字: {{editInfo.name}} 现备注: {{editInfo.remark}}</span>
          <el-form :inline="true" :model="editInfo" class="demo-form-inline">
            <el-form-item label="新名字">
              <el-input v-model="editInfo.newName" placeholder="..."></el-input>
            </el-form-item>
            <el-form-item label="新备注">
              <el-input v-model="editInfo.newRemark" placeholder="..."></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="editGift(editInfo.index)">保存并退出</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <el-row :gutter="20">
          <el-button type="info" plain @click="importVisible = true">导入列表</el-button>
          <el-dialog v-model="importVisible" title="导入列表" width="30%">
            <span>
              <input type="file" id="giftImport" v-on:change="importList()" />
            </span>
          </el-dialog>

          <el-button type="info" plain @click="addVisible = true">新增</el-button>
          <el-dialog v-model="addVisible" title="新增" width="30%">
            <el-form :inline="true" :model="newGift" class="demo-form-inline">
              <el-form-item label="名字">
                <el-input v-model="newGift.name" placeholder="名字"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="newGift.remark" placeholder="备注"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitGift">保存并退出</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import XLSX from "xlsx";

export default {
  name: "GiftList",
  data() {
    return {
      addVisible: false,
      editVisible: false,
      importVisible: false,
      newGift: { name: "无", remark: "无", num: 1 },
      editInfo: {
        name: "none",
        remark: "none",
        newName: "none",
        newRemark: "none",
        index: 0
      }
    };
  },
  computed: {
    gifts() {
      return this.$store.state.gifts;
    },
    selectedGifts() {
      return this.$store.state.selectedGifts;
    }
  },
  methods: {
    openEditDialog(index, name, remark) {
      this.editInfo.index = index;
      this.editInfo.name = name;
      this.editInfo.remark = remark;
      this.editInfo.newName = name;
      this.editInfo.newRemark = remark;
      this.editVisible = true;
    },
    editGift(index) {
      // modify a Gift object
      console.log("editGift");
      console.log(this.editInfo);
      let editedGift = {
        name: this.editInfo.newName,
        remark: this.editInfo.newRemark,
        num: 1
      };
      let payload = { i: index, gift: editedGift };
      this.$store.commit("editGift", payload);
      this.editVisible = false;
    },
    deleteGift(index) {
      // delete a gift object
      console.log("deleteGift");
      this.$store.commit("deleteGift", index);
    },
    minusGift(index) {
      // decrease the number of a gift object by 1
      console.log("minus");
      this.$store.commit("removeGiftNum", index);
    },
    plusGift(index) {
      // increase the number of a gift object by 1
      console.log("plusGift");
      this.$store.commit("addGiftNum", index);
    },
    submitGift() {
      // insert a newly created gift object to the list
      console.log("submitGift");
      this.addVisible = false;
      // check if name is duplicated
      if (
        this.gifts.every(i => {
          return i.name !== this.newGift.name;
        })
      ) {
        this.$store.commit(
          "insertNewGift",
          JSON.parse(JSON.stringify(this.newGift))
        );
      } else {
        alert("名字不能重复!");
      }
    },
    handleSelectionChange(val) {
      this.$store.commit("changeSelectedGifts", val);
      console.log(this.selectedGifts);
    },
    importList() {
      // import gift list data from a .xlsx file
      const input = document.querySelector("#giftImport");
      console.log(input.files);
      const reader = new FileReader();
      // parse binary to json using SheetJS
      reader.onload = () => {
        try {
          // convert the whole binary string to workbook object
          const wb = XLSX.read(reader.result, { type: "binary" });
          let data = []; // data storage
          // traverse sheets
          for (let sheet in wb.Sheets) {
            if (wb.Sheets.hasOwnProperty(sheet)) {
              data = data.concat(XLSX.utils.sheet_to_json(wb.Sheets[sheet]));
              break; // only get the first spreadsheet
            }
          }
          console.log(data);
          this.$store.commit("importGiftsXlsx", data);
        } catch (e) {
          alert("文件类型错误, 请上传.xlsx文件!");
          return;
        }
      };
      // user FileReader to fetch xlsx's binary
      reader.readAsBinaryString(input.files[0]);
      this.importVisible = false;
    }
  }
};
</script>

<style>
</style>