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

    if (!body.content && !body.embed) {
      return NextResponse.json(
        { error: 'Conteúdo de mensagem ou embed é obrigatório' },
        { status: 400 }
      );
    }

    if (body.embed) {
      const embed = body.embed;
      
      if (!embed.title && !embed.description && !embed.url) {
        return NextResponse.json(
          { error: 'A embed deve ter pelo menos um título, descrição ou URL' },
          { status: 400 }
        );
      }

      if (embed.title && embed.title.length > 256) {
        return NextResponse.json(
          { error: 'Título da embed não pode ter mais de 256 caracteres' },
          { status: 400 }
        );
      }

      if (embed.description && embed.description.length > 4096) {
        return NextResponse.json(
          { error: 'Descrição da embed não pode ter mais de 4096 caracteres' },
          { status: 400 }
        );
      }

      if (embed.author?.name && embed.author.name.length > 256) {
        return NextResponse.json(
          { error: 'Nome do autor não pode ter mais de 256 caracteres' },
          { status: 400 }
        );
      }

      if (embed.footer?.text && embed.footer.text.length > 2048) {
        return NextResponse.json(
          { error: 'Texto do rodapé não pode ter mais de 2048 caracteres' },
          { status: 400 }
        );
      }

      // Validar campos
      if (embed.fields && Array.isArray(embed.fields)) {
        if (embed.fields.length > 25) {
          return NextResponse.json(
            { error: 'Máximo de 25 campos permitidos' },
            { status: 400 }
          );
        }

        for (const field of embed.fields) {
          if (!field.name || !field.value) {
            return NextResponse.json(
              { error: 'Todos os campos devem ter nome e valor' },
              { status: 400 }
            );
          }

          if (field.name.length > 256) {
            return NextResponse.json(
              { error: 'Nome do campo não pode ter mais de 256 caracteres' },
              { status: 400 }
            );
          }

          if (field.value.length > 1024) {
            return NextResponse.json(
              { error: 'Valor do campo não pode ter mais de 1024 caracteres' },
              { status: 400 }
            );
          }
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
