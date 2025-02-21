import { Action, HandlerResponse } from "../../types/index.js";
import { z } from "zod";
import { ACTION_NAMES } from "../actionNames.js";
import { getPumpFunBondingCurve } from "../../tools/pumpfun/bonding_curve_pump_fun.js";
import { PumpAIAgent } from "src/agent/index.js";
import { BondingCurveResponse } from "../../types/index.js";

export type GetBondingCurvePumpFunInput = z.infer<typeof getBondingCurveSchema>;

const getBondingCurveSchema = z.object({
  mintAddress: z.string().min(32, "Invalid mint address"),
});

const getBondingCurvePumpFunAction: Action = {
  name: ACTION_NAMES.GET_BONDING_CURVE_PUMPFUN,
  similes: [
    "get pump.fun bonding curve",
    "check pump token progress",
    "get bonding progress",
    "pump.fun curve status",
    "check pump.fun curve",
  ],
  description:
    "Get the bonding curve state and progress of a token on Pump.fun",
  examples: [
    [
      {
        input: {
          mintAddress: "GjSn1XHncttWZtx9u6JB9BNM3QYqiumXfGbtkm4ypump",
        },
        output: {
          status: "success",
          data: {
            bondingProgress: 0.7793,
            priceSOL: 0.00123,
            mint: "GjSn1XHncttWZtx9u6JB9BNM3QYqiumXfGbtkm4ypump",
            curveAddress: "5BwXbPNGbfd2UuE8rkvASmJYXWXSiqmrhqJ1FX6rQnKd",
            virtualTokenReserves: "1000000000000",
            virtualSolReserves: "1230000000",
            realTokenReserves: "220700000000",
            realSolReserves: "271461000",
            tokenTotalSupply: "1000000000000000",
            complete: false,
          },
          message: "Bonding progress: 77.93%, Current price: 0.00123 SOL",
        },
        explanation: "Get the bonding curve state of a token on Pump.fun",
      },
    ],
  ],
  schema: getBondingCurveSchema,
  handler: async (
    agent: PumpAIAgent,
    input: Record<string, any>,
  ): Promise<HandlerResponse<BondingCurveResponse>> => {
    try {
      const curve = await getPumpFunBondingCurve(
        agent.connection,
        input.mintAddress,
      );

      return {
        status: "success",
        message: `Bonding progress: ${(curve.bondingProgress * 100).toFixed(2)}%, Current price: ${curve.priceSOL.toFixed(6)} SOL`,
        data: curve,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Failed to get bonding curve: ${error.message}`,
        error: {
          code: "GET_PUMPFUN_CURVE_ERROR",
          message: error.message,
          details: error,
        },
      };
    }
  },
};

export default getBondingCurvePumpFunAction;
