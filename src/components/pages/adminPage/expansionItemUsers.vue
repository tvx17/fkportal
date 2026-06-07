<template>
  <q-page class="row items-start q-pa-md">
    <div class="col-12">
      <q-expansion-item
        dense
        style="min-width: 95%"
        expand-separator
        icon="perm_identity"
        :label="t('expansionItemUsers.title')"
        @show="m.onShow"
        @hide="m.onHide"
      >
        <q-table
          flat
          dense
          :rows="r.userData.value"
          :columns="[
            { name: 'name', label: t('expansionItemUsers.name'), field: 'name', align: 'left' },
            { name: 'email', label: t('expansionItemUsers.email'), field: 'email', align: 'left' },
            { name: 'role', label: t('expansionItemUsers.role'), field: 'role', align: 'center' },
            {
              name: 'created_at',
              label: t('expansionItemUsers.created_at'),
              field: 'created_at',
              align: 'center',
            },
            {
              name: 'updated_at',
              label: t('expansionItemUsers.updated_at'),
              field: 'updated_at',
              align: 'center',
            },
            {
              name: 'active',
              label: t('expansionItemUsers.active'),
              field: 'active',
              align: 'center',
            },
            { name: 'actions', label: '', field: 'actions', align: 'right' },
          ]"
          row-key="id"
          :pagination="{ rowsPerPage: 0 }"
          hide-bottom
        >
          <template v-slot:header-cell-actions="props">
            <q-th :props="props">
              <q-btn flat dense icon="add" @click="m.onAddUser">
                <q-tooltip>{{ t('expansionItemUsers.addUser') }}</q-tooltip>
              </q-btn>
            </q-th>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" clickable @click="m.onEditUser(props.rowIndex)">
              <q-td key="name" :props="props">{{ props.row.name }}</q-td>
              <q-td key="email" :props="props">{{ props.row.email }}</q-td>
              <q-td key="role" :props="props">{{ props.row.role }}</q-td>
              <q-td key="created_at" :props="props">{{ props.row.created_at }}</q-td>
              <q-td key="updated_at" :props="props">{{ props.row.updated_at }}</q-td>
              <q-td key="active" :props="props"
                ><q-icon
                  :name="props.row.active == 1 ? 'check_circle' : 'cancel'"
                  :color="props.row.active == 1 ? 'green' : 'red'"
                  size="sm"
              /></q-td>
              <q-td key="actions" :props="props"> </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-expansion-item>
    </div>
  </q-page>

  <q-dialog v-model="r.dialogVisible.value" persistent>
    <q-card style="min-width: 450px" v-if="r.currentUser.value">
      <q-card-section>
        <q-toolbar>
          {{ t('expansionItemUsers.editUser') }}: {{ r.currentUser.value.name }}
          <q-space />
          <q-btn
            flat
            dense
            round
            :color="r.isDeleteConfirm.value ? 'negative' : 'default'"
            :icon="r.isDeleteConfirm.value ? 'done' : 'delete'"
            aria-label="delete"
            v-if="r.currentUserIndex.value !== -1"
            @click="r.isDeleteConfirm.value ? m.executeDelete() : m.onDeleteClick()"
          >
            <q-tooltip>
              {{ r.isDeleteConfirm.value ? 'NT: Wirklich löschen?' : 'NT: Benutzer löschen' }}
            </q-tooltip>
          </q-btn>
        </q-toolbar>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          v-model="r.currentUser.value.name"
          :label="t('expansionItemUsers.name')"
          :rules="[(val) => val.length >= 3 || 'NT: Please use at least 3 characters']"
        />
        <q-input
          ref="r.emailInput"
          v-model="r.currentUser.value.email"
          :label="t('expansionItemUsers.email')"
          :rules="[
            (val) => !!val || 'NT: E-Mail ist ein Pflichtfeld',
            (val) => v.isValidEmail(val) || 'NT: Bitte eine gültige E-Mail-Adresse eingeben',
          ]"
        />
        <q-select
          v-model="r.currentUser.value.role"
          :options="['admin', 'user']"
          :label="t('expansionItemUsers.role')"
          :rules="[(val) => !!val || 'NT: Rolle ist ein Pflichtfeld']"
        />

        <q-input
          v-model="r.currentUser.value.password"
          :type="r.isPasswordPassword.value ? 'password' : 'text'"
          :label="t('expansionItemUsers.password')"
          :rules="[
            (val) => r.currentUserIndex.value !== -1 || !!val || 'NT: Passwort ist ein Pflichtfeld',
            (val) =>
              !val || val.length >= 6 || 'NT: Das Passwort muss mindestens 6 Zeichen lang sein',
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="r.isPasswordPassword.value ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="r.isPasswordPassword.value = !r.isPasswordPassword.value"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="t('cancel')" color="primary" @click="m.onCancelEditing" />
        <q-btn
          flat
          :label="t('save')"
          color="primary"
          @click="m.onSaveUser"
          :disable="c.isSaveDisabled.value"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import { ref, computed, nextTick } from 'vue';

import { useI18n } from 'vue-i18n';
import { useComponentI18n } from 'src/composables/useComponentI18n';

useComponentI18n('expansionItemUsers', 'components');

const { t } = useI18n();

interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  password?: string;
}

const r = {
  dialogVisible: ref(false),
  currentUser: ref<User | null>(null),
  isPasswordPassword: ref(true),
  emailInput: ref<any>(null),
  isExpensionItemOpen: ref(false),
  currentUserIndex: ref(-1),
  userData: ref<User[]>([]),
  isDeleteConfirm: ref(false),
  deleteTimeout: ref<ReturnType<typeof setTimeout> | null>(null),
};

const c = {
  hasChanges: computed(() => {
    const index = r.currentUserIndex.value;
    if (!r.currentUser.value || index === -1) return false;
    const originalUser = r.userData.value[index];
    return JSON.stringify(r.currentUser.value) !== JSON.stringify(originalUser);
  }),
  isSaveDisabled: computed(() => {
    if (!r.currentUser.value) return true;

    const isNewUser = r.currentUserIndex.value === -1;

    // Basis-Validierung für Name, E-Mail und Rolle
    const isBaseValid =
      r.currentUser.value.name.trim().length >= 3 &&
      v.isValidEmail(r.currentUser.value.email) &&
      !!r.currentUser.value.role;

    // Passwort-Validierung (Mindestens 6 Zeichen)
    const passwordLength = r.currentUser.value.password?.length || 0;
    const isPasswordValid = passwordLength >= 6;

    if (isNewUser) {
      // Beim Neuanlegen: Basisdaten gültig UND Passwort erfüllt Mindestlänge
      return !(isBaseValid && isPasswordValid);
    } else {
      // Beim Editieren: Basisdaten gültig UND (entweder Passwort ist leer ODER Passwort hat valide Länge bei Änderung)
      const isPasswordOkOrEmpty = passwordLength === 0 || isPasswordValid;
      return !c.hasChanges.value || !(isBaseValid && isPasswordOkOrEmpty);
    }
  }),
};

const v = {
  isValidEmail: (val: string) => {
    const emailPattern =
      /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-]{2,}$/;
    return emailPattern.test(val);
  },
};

const m = {
  onSaveUser: () => {
    api
      .post('/user/save', r.currentUser.value)
      .then((response) => {
        if (response.data.success) {
          if (r.currentUserIndex.value === -1) {
            r.userData.value.push(r.currentUser.value as User);
          } else {
            r.userData.value[r.currentUserIndex.value] = r.currentUser.value as User;
          }
        } else {
          throw new Error('Failed to save user');
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
      });
    r.dialogVisible.value = false;
  },
  onAddUser: () => {
    r.isPasswordPassword.value = true;
    r.dialogVisible.value = true;
    r.currentUserIndex.value = -1;
    r.currentUser.value = { name: '', email: '', role: '', password: '' };
  },
  onEditUser: async (uIndex: number) => {
    r.isPasswordPassword.value = true;
    r.currentUserIndex.value = uIndex;

    // Kopie erstellen und leeres Passwort-Feld für das Editieren vorbereiten
    const userCopy = JSON.parse(JSON.stringify(r.userData.value[uIndex]));
    userCopy.password = '';
    r.currentUser.value = userCopy;

    r.dialogVisible.value = true;

    // Warten, bis der Dialog und das q-input im DOM existieren, dann Validierung sofort ausführen
    await nextTick();
    if (r.emailInput.value) {
      r.emailInput.value.validate();
    }
  },
  onCancelEditing: () => {
    if (r.deleteTimeout.value) clearTimeout(r.deleteTimeout.value);
    r.isDeleteConfirm.value = false;
    r.currentUserIndex.value = -1;
    r.dialogVisible.value = false;
    r.currentUser.value = null;
  },
  onShow: async () => {
    r.isExpensionItemOpen.value = true;
    await api
      .get('/user/get')
      .then((response) => {
        r.userData.value = response.data.data;
      })
      .catch((error) => {
        console.error('API Error:', error);
      });
  },
  onHide: () => {
    r.isExpensionItemOpen.value = false;
  },
  onDeleteClick: () => {
    if (!r.isDeleteConfirm.value) {
      r.isDeleteConfirm.value = true;
      r.deleteTimeout.value = setTimeout(() => {
        r.isDeleteConfirm.value = false;
      }, 3000);
    } else {
      if (r.deleteTimeout.value) clearTimeout(r.deleteTimeout.value);
      m.executeDelete();
    }
  },
  executeDelete: () => {
    if (!r.currentUser.value || r.currentUserIndex.value === -1) return;

    api
      .post('/user/delete', { id: r.currentUser.value.id })
      .then((response) => {
        if (response.data.success) {
          r.userData.value.splice(r.currentUserIndex.value, 1);
          r.dialogVisible.value = false;
        } else {
          throw new Error('Failed to delete user');
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
      })
      .finally(() => {
        r.isDeleteConfirm.value = false;
      });
  },
};
</script>
