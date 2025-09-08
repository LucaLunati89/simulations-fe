<template>
  <div class="device-component card">
    <Table :data="mappedPaginatedData">
      <template #actions="{ row }">
        <Button
          :label="addedDevices.includes(row.id) ? 'Aggiunto' : 'Aggiungi'"
          :disabled="addedDevices.includes(row.id) || isAddingDevice"
          :class="{
            'button-disabled': addedDevices.includes(row.id),
            'button-loading': isAddingDevice,
          }"
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

// Interfaccia per i dati mappati in italiano
interface DeviceIT {
  id: number;
  modello: string;
  costo_mensile: string;
  marca: string;
}

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

    const formatToItalianString = (value: number) => {
      return Number(value).toLocaleString("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    // Computed per mappare i dati in italiano
    const mappedPaginatedData = computed((): DeviceIT[] => {
      return paginatedData.value.map((device) => ({
        id: device.id,
        modello: device.model,
        costo_mensile: formatToItalianString(device.monthly_cost),
        marca: device.brand,
      }));
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
      mappedPaginatedData,
      currentPage,
      totalPages,
      onChangePage: (page: number) => (currentPage.value = page),
      addDevice,
      addedDevices,
      isAddingDevice,
    };
  },
};
</script>

<style scoped>
.button-disabled {
  background-color: #e0e0e0 !important;
  color: #999 !important;
  cursor: not-allowed !important;
  border-color: #ccc !important;
}

.button-disabled:hover {
  background-color: #e0e0e0 !important;
  color: #999 !important;
  transform: none !important;
  box-shadow: none !important;
}

.button-loading {
  opacity: 0.6;
  cursor: not-allowed !important;
}

.button-loading:hover {
  transform: none !important;
  box-shadow: none !important;
}
</style>
