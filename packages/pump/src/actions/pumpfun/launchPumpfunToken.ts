import { Action } from "../../types/index.js";
import { z } from "zod";
import { ACTION_NAMES } from "../actionNames.js";

export type LaunchPumpfunTokenInput = z.infer<typeof launchPumpfunTokenSchema>;

const launchPumpfunTokenSchema = z.object({
  tokenName: z
    .string()
    .min(1)
    .max(32)
    .describe("Name of the token")
    .default("Test Token"),
  tokenTicker: z
    .string()
    .min(2)
    .max(10)
    .describe("Ticker symbol of the token")
    .default("TEST"),
  description: z
    .string()
    .min(1)
    .max(1000)
    .describe("Description of the token")
    .default("A test token for demonstration purposes"),
  imageUrl: z
    .string()
    .url()
    .describe("URL of the token image")
    .default("https://picsum.photos/200"),
  twitter: z
    .string()
    .nullable()
    .transform((val) => val ?? "")
    .default("")
    .describe("Twitter handle (optional)"),
  telegram: z
    .string()
    .nullable()
    .transform((val) => val ?? "")
    .default("")
    .describe("Telegram group link (optional)"),
  website: z
    .string()
    .nullable()
    .transform((val) => val ?? "")
    .default("")
    .describe("Website URL (optional)"),
  initialLiquiditySOL: z
    .number()
    .min(0.0001)
    .default(0.0001)
    .describe("Initial liquidity in SOL"),
  slippageBps: z
    .number()
    .min(1)
    .max(1000)
    .default(5)
    .describe("Slippage tolerance in basis points"),
  priorityFee: z
    .number()
    .min(0.00001)
    .default(0.00005)
    .describe("Priority fee in SOL"),
});

const launchPumpfunTokenAction: Action = {
  name: ACTION_NAMES.LAUNCH_PUMPFUN_TOKEN,
  similes: [
    "create pumpfun token",
    "launch token on pumpfun",
    "deploy pumpfun token",
    "create meme token",
    "launch memecoin",
    "create pump token",
  ],
  description:
    "Launch a new token on Pump.fun with customizable metadata and initial liquidity. If no data is provided, test data will be used based on user's request or default test values.",
  examples: [
    [
      {
        input: {
          tokenName: "Sample Token",
          tokenTicker: "SMPL",
          description: "A sample token for demonstration",
          imageUrl: "https://example.com/token.png",
          twitter: "@sampletoken",
          telegram: "t.me/sampletoken",
          website: "https://sampletoken.com",
          initialLiquiditySOL: 0.1,
          slippageBps: 10,
          priorityFee: 0.0001,
        },
        output: {
          status: "success",
          signature: "2ZE7Rz...",
          mint: "7nxQB...",
          metadataUri: "https://arweave.net/...",
          message: "Successfully launched token on Pump.fun",
        },
        explanation:
          "Launch a new token with custom metadata and 0.1 SOL initial liquidity",
      },
    ],
  ],
  schema: launchPumpfunTokenSchema,
  // handler: async (agent: PumpAIAgent, input: Record<string, any>) => {
  //   try {
  //     const { tokenName, tokenTicker, description, imageUrl } = input;
  //     const result = await launchPumpFunToken(
  //       agent,
  //       tokenName,
  //       tokenTicker,
  //       description,
  //       imageUrl,
  //       input,
  //     );

  //     return {
  //       status: "success",
  //       signature: result.signature,
  //       mint: result.mint,
  //       metadataUri: result.metadataUri,
  //       message: "Successfully launched token on Pump.fun",
  //     };
  //   } catch (error: any) {
  //     return {
  //       status: "error",
  //       message: `Failed to launch token: ${error.message}`,
  //     };
  //   }
  // },
};

export default launchPumpfunTokenAction;
