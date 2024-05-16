# thenameless.net

A playspace for experimenting with intelligence amplification.

## Setup

**Step 1**

(recommended)

Install bun, an all-in-one toolkit with a package manager, by following the instruction provided on [the official docs](https://bun.sh/docs/installation).

**Step 2**

Install the necessary dependencies and then run the development server:

```bash
# install dependencies
bun install
# run Next.js development server
bun dev
# visit http://localhost:7741
```

## FAQ

Q: Why do I need to provide my API key to use the interactive playgrounds on [Anthropic: Prompt Engineering Interactive Tutorial](https://thenameless.net/astral-kit/anthropic-peit-00)?

A: The playgrounds utilize Anthropic's [Message API](https://docs.anthropic.com/en/api/messages) to generate texts based on your input.

Q: Where exactly do you use my API key?

A: Your key is used in two places within the codebase:

1. [/chat endpoint](https://github.com/thenameless7741/thenameless.net/blob/master/src/app/api/chat/anthropic/route.ts): This endpoint generates texts based on the prompt you provide and the output is displayed under "Claude's Response" section.

2. [/tool endpoint](https://github.com/thenameless7741/thenameless.net/blob/master/src/app/api/tool/anthropic/route.ts): This endpoint is used to validate exercise answers more robustly (and only when necessary). The output is visualized as a green check mark, or a red "x" in the top-right of "Claude's Response" section. This feature is an addition to the original tutorial.

The key is [stored](https://github.com/thenameless7741/thenameless.net/blob/master/src/app/astral-kit/store.ts) in the browser's local storage.

Q: Why do you pass my API key to these endpoints instead of calling the API locally in my browser?

A. Anthropic does not allow its API to be called from browser environments to prevent API leaks. I've asked Anthropic on [Discord](https://discord.com/channels/1072196207201501266/1229110219385077800/1230832859665793065) to remove this restriction by implementing a flag similar to OpenAI's `dangerouslyAllowBrowser`. The unofficial answer is that Anthropic might add OAuth support in the future. So until they come up with a solution, we're stuck using endpoints/proxies as a workaround, even though it's not the most secure way to handle this.

## Acknowledgment

- [Cosmos Arena](https://thenameless.net/cosmos-arena) data is derived from Hugging Face's [Open LLM Leaderboard](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard), obtained using [Weyaxi](https://twitter.com/Weyaxi)'s [scraper](https://github.com/Weyaxi/scrape-open-llm-leaderboard)
- [Anthropic: Prompt Engineering Interactive Tutorial](https://thenameless.net/astral-kit/anthropic-peit-00) is based on a tutorial published on [Google Sheets](https://docs.google.com/spreadsheets/d/1jIxjzUWG-6xBVIa2ay6yDpLyeuOh_hR_ZB75a47KX_E) by Anthropic
