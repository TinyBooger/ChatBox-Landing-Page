def parse_sample_dialogue(text: str):
    lines = text.strip().splitlines()
    messages = []
    for line in lines:
        line = line.strip()
        if line.startswith("<user>:"):
            messages.append({
                "role": "user",
                "content": line[len("<user>:"):].strip()
            })
        elif line.startswith("<bot>:"):
            messages.append({
                "role": "assistant",
                "content": line[len("<bot>:"):].strip()
            })
    return messages
