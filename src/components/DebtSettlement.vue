<template>
  <div class="debt-settlement-container">
    <q-table
      title="Ajuste de cuentas"
      :data="debtSettlementTableData"
      :columns="columns"
      row-key="name"
      hide-bottom
    />
  </div>
</template>

<script>
import { round } from '@/utils/format';
import { participantDebtsSettlement } from '@/utils/algorithms';

export default {
  name: 'debtSettlement',
  computed: {
    columns() {
      const currenciesColumn = this.$store.getters.allCurrencies.reduce(
        (acc, currency) =>
          acc.concat({
            name: currency.value,
            required: true,
            label: currency.value,
            align: 'center',
            field: row => row[currency.value],
            format: val => `${round(val, 2)}`,
            sortable: true,
          }),
        []
      );
      return [
        {
          name: 'debtor',
          required: true,
          label: 'Deudor',
          align: 'left',
          field: row => row.debtor,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'creditor',
          required: true,
          label: 'Acreedor',
          align: 'left',
          field: row => row.creditor,
          format: val => `${val}`,
          sortable: true,
        },
        ...currenciesColumn,
      ];
    },
    /* Output structure
    {
      "Santiago": {
        "Exe": {
          ARS: 10,
          CLP: 20000
        }
        Diego: {
          ARS: 1500
        }
      },
      "Exe":{...}
    }*/
    participanDebts() {
      return participantDebtsSettlement(
        this.$store.state.participants,
        this.$store.state.transactions,
        this.$store.getters.allCurrencies
      );
    },

    /**
  {
  "Exe": {
    "Santiago": {
      "USD": 43.333333333333336
    },
    "Diego": {
      "ARS": 400
    }
  },
  "Diego": {
    "Santiago": {
      "USD": 50
    },
    "Exe": {
      "USD": 3.3333333333333335
    }
  },
  "Santiago": {
    "Diego": {
      "ARS": 400
    }
  }
}
     */

    debtSettlementTableData() {
      const debts = this.participanDebts;

      return Object.keys(debts).reduce((debtorAcc, debtor) => {
        const debtorDebts = debts[debtor];
        return debtorAcc.concat(
          ...Object.keys(debtorDebts).reduce((creditorAcc, creditor) => {
            return creditorAcc.concat({
              ...debtorDebts[creditor],
              creditor,
              debtor,
            });
          }, [])
        );
      }, []);
    },
  },
};
</script>

<style></style>
