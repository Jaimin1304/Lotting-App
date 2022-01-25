<template>
  <div>
    <el-container>
      <el-main>
        <el-row :gutter="20">
          <el-table :data="persons" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60" />
            <el-table-column prop="name" label="名字" width="150" />
            <el-table-column prop="remark" label="备注" width="120" />
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="openEditDialog(scope.$index, scope.row.name, scope.row.remark)"
                >编辑</el-button>
                <el-button type="text" size="small" @click="deletePerson(scope.$index)">删除</el-button>
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
              <el-button type="primary" @click="editPerson(editInfo.index)">保存并退出</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <el-row :gutter="20">
          <el-button type="info" plain @click="importVisible = true" append-to-body>导入列表</el-button>
          <el-dialog v-model="importVisible" title="导入列表" width="30%">
            <span>
              <input type="file" id="personImport" v-on:change="importList()" />
            </span>
          </el-dialog>

          <el-button type="info" plain @click="addVisible = true">新增</el-button>
          <el-dialog v-model="addVisible" title="新增" width="30%">
            <el-form :inline="true" :model="newPerson" class="demo-form-inline">
              <el-form-item label="名字">
                <el-input v-model="newPerson.name" placeholder="名字"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="newPerson.remark" placeholder="备注"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitPerson">保存并退出</el-button>
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
  name: "PersonList",
  data() {
    return {
      addVisible: false,
      editVisible: false,
      importVisible: false,
      newPerson: { name: "无名氏", remark: "无" },
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
    persons() {
      return this.$store.state.persons;
    },
    selectedPersons() {
      return this.$store.state.selectedPersons;
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
    editPerson(index) {
      // modify a person object
      console.log("editPerson");
      console.log(this.editInfo);
      let editedPerson = {
        name: this.editInfo.newName,
        remark: this.editInfo.newRemark
      };
      let payload = { i: index, person: editedPerson };
      this.$store.commit("editPerson", payload);
      this.editVisible = false;
    },
    deletePerson(index) {
      // delete a person object
      console.log("deletePerson");
      this.$store.commit("deletePerson", index);
    },
    submitPerson() {
      // insert a newly created person object to the list
      console.log("submitPerson");
      this.addVisible = false;
      // check if name is duplicated
      if (
        this.persons.every(i => {
          return i.name !== this.newPerson.name;
        })
      ) {
        this.$store.commit(
          "insertNewPerson",
          JSON.parse(JSON.stringify(this.newPerson))
        );
      } else {
        alert("名字不能重复!");
      }
    },
    handleSelectionChange(val) {
      this.$store.commit("changeSelectedPersons", val);
      //console.log(this.selectedPersons)
    },
    importList() {
      // import person list data from a .xlsx file
      const input = document.querySelector("#personImport");
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
          this.$store.commit("importPersonsXlsx", data);
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