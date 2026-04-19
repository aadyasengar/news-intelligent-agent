import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from collections import defaultdict

# Ensure required tokenizers are downloaded
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')

def summarize_text(text: str, sentence_count: int = 3) -> str:
    """
    Extractive summarization using word frequency scoring.
    """
    if not text or len(text.strip()) == 0:
        return ""
    
    sentences = sent_tokenize(text)
    if len(sentences) <= sentence_count:
        return text

    stop_words = set(stopwords.words("english"))
    words = word_tokenize(text.lower())
    
    # Calculate word frequency
    freq_table = dict()
    for word in words:
        if word.isalnum() and word not in stop_words:
            if word in freq_table:
                freq_table[word] += 1
            else:
                freq_table[word] = 1

    # Weight sentences based on containing high-frequency words
    sentence_scores = defaultdict(int)
    for sentence in sentences:
        sentence_words = word_tokenize(sentence.lower())
        for word in sentence_words:
            if word in freq_table:
                # Add word freq to the sentence score.
                sentence_scores[sentence] += freq_table[word]

    # Sort sentences by score and pick top N
    top_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)[:sentence_count]
    
    # Extract the original string text roughly in original order
    # (To maintain flow, we re-sort by their original occurrence index)
    original_order = sorted(top_sentences, key=lambda x: sentences.index(x[0]))
    
    summary = " ".join([sent[0] for sent in original_order])
    return summary

def summarize_articles(articles: list, sentence_count: int = 4) -> str:
    """
    Given a list of article dictionaries with a 'summary' or 'description' field,
    concatenate them and produce a multi-source cohesive summary.
    """
    combined_text = ""
    for article in articles:
        text = article.get('summary', '') or article.get('description', '') or article.get('title', '')
        combined_text += text + ". "
    
    return summarize_text(combined_text, sentence_count)
