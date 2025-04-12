export interface Env {
	GEMINI_API_KEY: string;
  }
  
  interface JournalRequest {
	entry: string;
	timestamp: string;
  }
  
  export default {
	async fetch(request: Request, env: Env): Promise<Response> {
	  if (request.method !== 'POST') {
		return new Response('Only POST allowed', { status: 405 });
	  }
  
	  try {
		const body = await request.json() as JournalRequest;
  
		if (!body.entry || !body.timestamp) {
		  return new Response(JSON.stringify({ error: 'Missing entry or timestamp' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		  });
		}
  
		const { entry, timestamp } = body;
  
		const prompt = `
  This is a journal entry: "${entry}"
  Date: ${timestamp}
  
  Analyze the tone, emotional state, and check for any language that might indicate paranoia or distress.
  Please compile them under
  Words of Concern, and only compile words that are concerning, if any.
  Also note whether the entry seems to be 
  realistic and founded in reality. If not, gently remind them of a more realistic alternative.
  Return a gentle, supportive message.

  ⚠️ Please also include a *Mood Score* (a number between -1 and +1):
- -1 = extremely distressed or paranoid
-  0 = neutral
- +1 = calm or positive

  Please respond with the following format, make sure to include these headers:
	*Tone:* ...
	*Emotional Stress:* ...
	*Analysis:* ...
	*Words of Concern*...
	*Mood Score:* ...
	*Supportive Message:* ...
  `;
  
		const geminiRes = await fetch(
		  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
		  {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
			  contents: [
				{
				  parts: [{ text: prompt }]
				}
			  ]
			})
		  }
		);
  
		type GeminiResponse = {
			candidates?: Array<{
			  content?: {
				parts?: Array<{ text?: string }>
			  }
			}>
		  };
		  
		  const data = await geminiRes.json() as GeminiResponse;
		const message = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis returned.';
		console.log("Gemini raw response:", JSON.stringify(data, null, 2));
  
		return new Response(JSON.stringify({ message }), {
		  headers: { 'Content-Type': 'application/json' },
		});
  
	  } catch (error: any) {
		return new Response(JSON.stringify({
		  error: 'Something went wrong',
		  details: error.message || error.toString(),
		}), {
		  status: 500,
		  headers: { 'Content-Type': 'application/json' },
		});
	  }
	}
  };
  