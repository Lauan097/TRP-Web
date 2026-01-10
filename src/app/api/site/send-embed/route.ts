import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/utils/constants';

interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface EmbedAuthor {
  name?: string;
  icon_url?: string;
  url?: string;
}

interface EmbedFooter {
  text?: string;
  icon_url?: string;
}

interface EmbedImage {
  url?: string;
}

interface EmbedData {
  title?: string;
  description?: string;
  url?: string;
  color?: string;
  author?: EmbedAuthor;
  thumbnail?: EmbedImage;
  image?: EmbedImage;
  fields?: EmbedField[];
  footer?: EmbedFooter;
  timestamp?: string;
}

interface RequestBody {
  channelId: string;
  content?: string;
  embed?: EmbedData;
  embeds?: EmbedData[];
  editLastMessage?: boolean;
}

function validateEmbed(embed: EmbedData): string | null {
  if (!embed.title && !embed.description && !embed.url && !embed.image && !embed.thumbnail && (!embed.fields || embed.fields.length === 0)) {
    return 'A embed deve ter pelo menos um título, descrição, URL, imagem ou campos';
  }

  if (embed.title && embed.title.length > 256) {
    return 'Título da embed não pode ter mais de 256 caracteres';
  }

  if (embed.description && embed.description.length > 4096) {
    return 'Descrição da embed não pode ter mais de 4096 caracteres';
  }

  if (embed.author?.name && embed.author.name.length > 256) {
    return 'Nome do autor não pode ter mais de 256 caracteres';
  }

  if (embed.footer?.text && embed.footer.text.length > 2048) {
    return 'Texto do rodapé não pode ter mais de 2048 caracteres';
  }

  if (embed.fields && Array.isArray(embed.fields)) {
    if (embed.fields.length > 25) {
      return 'Máximo de 25 campos permitidos por embed';
    }

    for (const field of embed.fields) {
      if (!field.name || !field.value) {
        return 'Todos os campos devem ter nome e valor';
      }

      if (field.name.length > 256) {
        return 'Nome do campo não pode ter mais de 256 caracteres';
      }

      if (field.value.length > 1024) {
        return 'Valor do campo não pode ter mais de 1024 caracteres';
      }
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();

    if (!body.channelId) {
      return NextResponse.json(
        { error: 'ID do canal é obrigatório' },
        { status: 400 }
      );
    }

    if (!body.content && !body.embed && (!body.embeds || body.embeds.length === 0)) {
      return NextResponse.json(
        { error: 'Conteúdo de mensagem ou embed é obrigatório' },
        { status: 400 }
      );
    }

    if (body.embed) {
      const error = validateEmbed(body.embed);
      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }
    }

    if (body.embeds && Array.isArray(body.embeds)) {
      if (body.embeds.length > 10) {
         return NextResponse.json({ error: 'Máximo de 10 embeds por mensagem' }, { status: 400 });
      }
      for (let i = 0; i < body.embeds.length; i++) {
        const error = validateEmbed(body.embeds[i]);
        if (error) {
          return NextResponse.json({ error: `Embed ${i + 1}: ${error}` }, { status: 400 });
        }
      }
    }

    if (body.content && body.content.length > 2000) {
      return NextResponse.json(
        { error: 'Conteúdo da mensagem não pode ter mais de 2000 caracteres' },
        { status: 400 }
      );
    }

    const apiUrl = API_BASE_URL;
    
    const response = await fetch(`${apiUrl}/api/site/embeds/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channelId: body.channelId,
        content: body.content || undefined,
        embed: body.embed || undefined,
        embeds: body.embeds || undefined,
        editLastMessage: body.editLastMessage || false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Erro ao enviar embed' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: 'Embed enviada com sucesso!', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
