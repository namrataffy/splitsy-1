import React, { useEffect, useRef, useState } from "react";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API";
import { Pie } from "react-chartjs-2";

let Chart = require("chart.js");

let ctx = "myChart";

let payersTotal = 0;

function Breakdown(props) {
  const { receipt, payers, items, totalCalculator } = props;
  console.log(props);

  // useEffect(() => {
  //   if (props.payers && props.items && props.receipt) {
  //     if (props.payers[0] && props.items[0] && props.receipt[0]) {
  //       makeChart();
  //     }
  //   }
  // }, [props]);

  function totalPayedCalc() {
    let paid = 0;
    for (let i = 0; i < props.payers[0].length; i++) {
      if (props.payers[0][i].paid) {
        paid = paid + parseFloat(props.payers[0][i].amountDue);
      }
    }
    return parseFloat(paid).toFixed(2);
  }

  function makeChartData() {
    let names = [];
    let amountDue = [];
    for (let i = 0; i < payers[0].length; i++) {
      names.push(payers[0][i].name);
    }
    for (let i = 0; i < payers[0].length; i++) {
      amountDue.push(payers[0][i].amountDue);
    }
    let data = {
      datasets: [
        {
          data: amountDue,
          backgroundColor: [
            "#f44336",
            "#ff9800",
            "#2196f3",
            "#4caf50",
            "#f48fb1",
            "#90caf9"
          ]
        }
      ],
      labels: names
    };
    return data;
  }

  return (
    <div className="breakdown h-100">
      <h4>Breakdown</h4>
      <div>
        {props.payers ? (
          <Pie
            data={makeChartData()}
            width={200}
            height={200}
            options={{ maintainAspectRatio: false }}
          ></Pie>
        ) : null}
      </div>{" "}
      <br />
      <table className="table w-100">
        <tbody>
          {props.payers
            ? props.payers[0].map((payer, index, payers) => {
                return (
                  <tr key={payer.id}>
                    <td className="text-left">
                      {payer.name}{" "}
                      {payer.paid === true ? (
                        <span
                          onClick={() => {
                            props.paid(payer, index);
                          }}
                          className="badge badge-success"
                        >
                          Paid
                        </span>
                      ) : (
                        <span
                          onClick={() => {
                            props.paid(payer, index);
                          }}
                          className="badge badge-warning"
                        >
                          Not Paid
                        </span>
                      )}
                    </td>
                    <td className="text-right">${payer.amountDue}</td>
                  </tr>
                );
              })
            : null}
          <tr>
            <td className="text-left" style={{ fontWeight: "bold" }}>
              Total Paid:
            </td>
            <td className="text-right" style={{ fontWeight: "bold" }}>
              ${props.payers ? totalPayedCalc() : null}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default Breakdown;
