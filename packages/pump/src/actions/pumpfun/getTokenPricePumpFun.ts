import { Action, HandlerResponse } from "../../types/index.js";
import { z } from "zod";
import { ACTION_NAMES } from "../actionNames.js";
import { getPumpFunTokenPrice } from "../../tools/pumpfun/token_price_pump_fun.js";
import { PumpAIAgent } from "src/agent/index.js";
import { TokenPriceResponse } from "../../types/index.js";

export type GetTokenPricePumpFunInput = z.infer<
  typeof getTokenPricePumpFunSchema
>;

const getTokenPricePumpFunSchema = z.object({
  mintAddress: z.string().min(32, "Invalid mint address"),
});

const getTokenPricePumpFunAction: Action = {
  name: ACTION_NAMES.GET_TOKEN_PRICE_PUMPFUN,
  similes: [
    "get pump.fun token price",
    "check pump token price",
    "get token price on pump",
    "pump.fun price check",
    "check pump.fun price",
  ],
  description: "Get the current price of a token on Pump.fun",
  examples: [
    [
      {
        input: {
          mintAddress: "GjSn1XHncttWZtx9u6JB9BNM3QYqiumXfGbtkm4ypump",
        },
        output: {
          status: "success",
          data: {
            priceSOL: 0.00123,
            mint: "GjSn1XHncttWZtx9u6JB9BNM3QYqiumXfGbtkm4ypump",
            curveAddress: "5BwXbPNGbfd2UuE8rkvASmJYXWXSiqmrhqJ1FX6rQnKd",
          },
          message: "Current price: 0.00123 SOL",
        },
        explanation: "Get the current price of a token on Pump.fun",
      },
    ],
  ],
  schema: getTokenPricePumpFunSchema,
  handler: async (
    agent: PumpAIAgent,
    input: Record<string, any>,
  ): Promise<HandlerResponse<TokenPriceResponse>> => {
    try {
      const price = await getPumpFunTokenPrice(
        agent.connection,
        input.mintAddress,
      );
      console.log("price", price);

      return {
        status: "success",
        message: `Current price: ${price.priceSOL.toFixed(6)} SOL`,
        data: price,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Failed to get token price: ${error.message}`,
        error: {
          code: "GET_PUMPFUN_PRICE_ERROR",
          message: error.message,
          details: error,
        },
      };
    }
  },
};

export default getTokenPricePumpFunAction;
