<?php

namespace App\Form;

use App\Entity\Book;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class BookFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id',HiddenType::class,[
                'mapped'=>false,
                'attr'=>[
                    'autocomplete'=>'off'
                ]
            ])
            ->add('reference',TextType::class,[
                'label'=>false,
                'attr'=>[
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                    'placeholder'=>'Réfèrence'
                ],
                 'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer une réfèrence',
                    ]),
                 ],
            ])
            ->add('title',TextType::class,[
                'label'=>false,
                'attr'=>[
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                    'placeholder'=>'Titre'
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer un titre',
                    ]),
                ],
            ])
            ->add('author',TextType::class,[
                'label'=>false,
                'attr'=>[
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                    'placeholder'=>'Auteur'
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer un auteur',
                    ]),
                ],
            ])
            ->add('category',ChoiceType::class,[
                'label'=>false,
                'attr'=>[
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                ],
                'choices'=>[
                    'Technologie'=>'Technologie',
                    'Sciences'=>'Sciences',
                    'Informatique & Internet'=>'Informatique & Internet',
                    'Sciences Politiques'=>'Sciences Politiques',
                    'Sciences Sociales'=>'Sciences Sociales',
                    'Mathématiques'=>'Mathématiques',
                    'Médecine'=>'Médecine',
                    'Langues & Linguistique'=>'Langues & Linguistique',
                    'Sports'=>'Sports',
                    'Voyages'=>'Voyages',
                    'Histoire'=>'Histoire',
                    'Economie & Affaires'=>'Economie & Affaires',
                    'Droit'=>'Droit',
                    'Biographie & Autobiographie'=>'Biographie & Autobiographie',
                    'Bandes Dessinées'=>'Bandes Dessinées',
                    'Arts du Spectacle'=>'Arts du Spectacle',
                    'Art Dramatique'=>'Art Dramatique',
                    'Arts'=>'Arts',
                    'Architecture'=>'Architecture',
                    'Philosophie'=>'Philosophie',
                    'Spiritualité'=>'Spiritualité',
                    'Etude de Langues Etrangeres'=>'Etude de Langues Etrangeres',
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez choisir une categorie',
                    ]),
                ],
            ])
            ->add('subject',TextareaType::class,[
                'label'=>false,
                'required'=>false,
                'attr'=>[
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                    'placeholder'=>'Sujet',
                ],
            ])
            ->add('picture',FileType::class,[
                'label'=>false,
                'mapped'=>false,
                'multiple'=>true,
                'required'=>false,
                'attr'=>[
                    'class'=>'custom-file-input',
                    'placeholder'=>'Images',
                    'aria-describedby'=>'inputGroupFileAddon01'
                ]
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Book::class,
            'csrf_protection' => true,
            'csrf_field_name' => '_token',
            'csrf_token_id'   => 'book_item',
        ]);
    }
}
