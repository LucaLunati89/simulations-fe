<template>
  <div class="device-component card">
    <Table :data="paginatedData">
      <template #actions="{ row }">
        <Button
          label="Aggiungi"
          :disabled="addedDevices.includes(row.id)"
          @click.stop="addDevice(row.id)"
        />
      </template>
    </Table>

    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      :next="currentPage < totalPages"
      :previous="currentPage > 1"
      @change-page="onChangePage"
    />
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type { Device } from "../../api/types";
import Table from "../atomic/Table.vue";
import Pagination from "../atomic/Pagination.vue";
import Button from "../atomic/Button.vue";
import { getAllDevices } from "../../api/devices";
import { addDeviceToSimulation } from "../../api/simulationDevice";

// 🔍 Counter globale per tracciare le chiamate
let addDeviceCounter = 0;

export default {
  name: "DeviceTable",
  components: { Table, Pagination, Button },
  props: {
    simulationId: { type: Number, required: true },
    addedDeviceIds: { type: Array as () => number[], default: () => [] },
  },
  emits: ["deviceAdded"],

  setup(props, { emit }) {
    console.log("🏗️ DeviceTable setup called");

    const tableData = ref<Device[]>([]);
    const addedDevices = ref<number[]>([...props.addedDeviceIds]);
    const currentPage = ref(1);
    const pageSize = 5;
    // 🔒 Flag per prevenire doppie chiamate
    const isAddingDevice = ref(false);

    const totalPages = computed(() =>
      Math.ceil(tableData.value.length / pageSize)
    );

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return tableData.value.slice(start, start + pageSize);
    });

    const loadData = async () => {
      tableData.value = await getAllDevices();
    };

    const addDevice = async (deviceId: number) => {
      addDeviceCounter++;
      console.log(
        `🔵 [${addDeviceCounter}] addDevice chiamata per device ${deviceId}`
      );
      console.log(
        `🔵 [${addDeviceCounter}] isAddingDevice: ${isAddingDevice.value}`
      );

      // 🛑 Previeni doppie chiamate
      if (isAddingDevice.value) {
        console.log(
          `🛑 [${addDeviceCounter}] Chiamata bloccata: operazione già in corso`
        );
        return;
      }

      if (addedDevices.value.includes(deviceId)) {
        console.log(
          `⚠️ [${addDeviceCounter}] Device ${deviceId} già aggiunto, esco`
        );
        return;
      }

      isAddingDevice.value = true;
      console.log(`🔒 [${addDeviceCounter}] Lock attivato`);

      try {
        console.log(
          `📡 [${addDeviceCounter}] Chiamando API addDeviceToSimulation...`
        );
        const simulationDevice = await addDeviceToSimulation(
          props.simulationId,
          deviceId
        );
        console.log(
          `✅ [${addDeviceCounter}] API completata, risposta:`,
          simulationDevice
        );

        addedDevices.value.push(deviceId);
        console.log(
          `📝 [${addDeviceCounter}] Device aggiunto alla lista locale`
        );

        console.log(`📤 [${addDeviceCounter}] Emettendo evento deviceAdded...`);
        emit("deviceAdded", simulationDevice);
        console.log(`✅ [${addDeviceCounter}] Evento emesso`);
      } catch (err) {
        console.error(
          `❌ [${addDeviceCounter}] Errore nell'aggiunta del dispositivo:`,
          err
        );
      } finally {
        // 🔓 Rilascia il lock dopo 500ms per sicurezza
        setTimeout(() => {
          isAddingDevice.value = false;
          console.log(`🔓 [${addDeviceCounter}] Lock rilasciato`);
        }, 500);
      }
    };

    watch(
      () => props.addedDeviceIds,
      (newIds) => {
        console.log("👁️ DeviceTable: watch triggered, newIds:", newIds);
        addedDevices.value = [...newIds];
      },
      { immediate: true }
    );

    onMounted(() => {
      console.log("🚀 DeviceTable mounted");
      loadData();
    });

    return {
      tableData,
      paginatedData,
      currentPage,
      totalPages,
      onChangePage: (page: number) => (currentPage.value = page),
      addDevice,
      addedDevices,
      isAddingDevice, // Aggiungi questo per debug
    };
  },
};
</script>
